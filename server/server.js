/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
const ASGARDEO_BASE_URL = process.env.ASGARDEO_BASE_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TOKEN_ENDPOINT=process.env.ASGARDEO_TOKEN_ENDPOINT;
const GEO_API_KEY = process.env.GEO_API_KEY;
const ASGARDEO_BASE_URL_SCIM2 = ASGARDEO_BASE_URL + "/scim2";
const VITE_REACT_APP_CLIENT_BASE_URL = process.env.VITE_REACT_APP_CLIENT_BASE_URL;
const MY_IP = process.env.MY_IP;

const corsOptions = {
    origin: [ VITE_REACT_APP_CLIENT_BASE_URL ],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
    credentials: true,
    enablePreflight: true
}
const app = express();

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// In-memory storage for token data
let tokenData = {
  access_token: null,
  scope: null,
  token_type: null,
  expires_in: null,
  expires_at: null, // expiration time to request new token
};

const getAuthHeader = () => {
  const authString = `${CLIENT_ID}:${CLIENT_SECRET}`;
  return "Basic " + Buffer.from(authString).toString("base64");
};

app.post("/signup", async (req, res) => {
  try {
    const { username, password, email, firstName, 
      lastName, country, accountType, dateOfBirth, 
      mobile 
    } = req.body;

    const token = await getAccessToken();

    console.log(token);
    console.log(ASGARDEO_BASE_URL_SCIM2);

    const response = await axios.post(
      `${ASGARDEO_BASE_URL_SCIM2}/Users`,
      {
        schemas: [],
        userName: `DEFAULT/${username}`,
        password: password,
        emails: [{
          value: email,
          primary: true
          }
        ],
        name: {
          givenName: firstName,
          familyName: lastName
        },
        "urn:scim:wso2:schema": {
          "country": country,
          "dateOfBirth": dateOfBirth,
        },
        "phoneNumbers": [
          {
              "type": "mobile",
              "value": mobile
          }
        ],
        "urn:scim:schemas:extension:custom:User": {
          "accountType": accountType
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  

    res.json({ message: "User registered successfully", data: response.data });
  } catch (error) {
    console.log("SCIM2 API Error:", error.detail || error.message);
    console.log(error);
    res.status(400).json({ error: error.detail || "Signup failed" });
  }
});

// Get a new token if expired or not available
const getAccessToken = async () => {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

  if (tokenData.access_token && tokenData.expires_at && currentTime < tokenData.expires_at) {
    console.log(`Using cached access token. Expires in ${tokenData.expires_at - currentTime} seconds.`);
    return tokenData.access_token;
  }

  console.log("Fetching new access token...");

  try {
    const response = await axios.post(
      TOKEN_ENDPOINT,
      "grant_type=client_credentials&scope=internal_user_mgt_create internal_user_mgt_view",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: getAuthHeader(),
        },
      }
    );

    const issuedAt = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const expiresIn = response.data.expires_in; // Token validity duration in seconds

    // Store the new token data with exact expiration time
    tokenData = {
      access_token: response.data.access_token,
      scope: response.data.scope,
      token_type: response.data.token_type,
      expires_in: expiresIn,
      expires_at: issuedAt + expiresIn, // Exact expiration timestamp
    };

    console.log(`New access token received. Expires at ${new Date(tokenData.expires_at * 1000).toISOString()}`);
    return tokenData.access_token;
  } catch (error) {
    console.error("Error fetching token:", error.response?.data || error.message);
    throw new Error("Failed to get access token");
  }
};

// IP geolocation request
app.post("/risk", async (req, res) => {
  try {
      console.log("request receivedd");
      let { ip, country } = req.body;
      console.log(ip);
      ip = "103.87.14.173";
      if (!ip || !country) {
          return res.status(400).json({ error: "IP address and country name are required" });
      }
      // Call the IP Geolocation API
      const response = 
        await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${GEO_API_KEY}&ip=${MY_IP}&fields=country_name`);

      const country_name = response.data.country_name;
      // Determine risk based on country code
      const hasRisk = country_name !== country;
      res.json({ hasRisk });

  } catch (error) {
      console.error("Error fetching IP geolocation:", error.message);
      res.status(500).json({ error: "Failed to process request" });
  }
});

app.listen(PORT, () => console.log(`🌐 Server running at: http://${HOST}:${PORT}`));
