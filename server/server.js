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

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";
import https from "https";
import pino from "pino";

dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost";
const ASGARDEO_BASE_URL = process.env.ASGARDEO_BASE_URL;
const CLIENT_ID = process.env.SERVER_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.SERVER_APP_CLIENT_SECRET;
const TOKEN_ENDPOINT = process.env.ASGARDEO_TOKEN_ENDPOINT;
const GEO_API_KEY = process.env.GEO_API_KEY;
const ASGARDEO_BASE_URL_SCIM2 = ASGARDEO_BASE_URL + "/scim2";
const VITE_REACT_APP_CLIENT_BASE_URL =
  process.env.VITE_REACT_APP_CLIENT_BASE_URL;
const userStoreName = process.env.USER_STORE_NAME || "PRIMARY";

// Added to compress self signed cert validation
const agent = new https.Agent({
  rejectUnauthorized: false, // Disable SSL certificate validation
});
const corsOptions = {
  origin: [VITE_REACT_APP_CLIENT_BASE_URL],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Methods",
    "Access-Control-Request-Headers",
  ],
  credentials: true,
  enablePreflight: true,
};

const app = express();

const logger = pino({
  level: process.env.LOG_LEVEL || "debug",
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// logger middleware.
app.use((req, res, next) => {
  logger.debug({
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
  });
  next();
});

// In-memory storage for token data
let tokenData = {
  access_token: null,
  scope: null,
  token_type: null,
  expires_in: null,
  expires_at: null, // expiration time to request new token
};

// In-memory storage for organization token data
let orgTokenCache = {};

const getAuthHeader = () => {
  const authString = `${CLIENT_ID}:${CLIENT_SECRET}`;
  return "Basic " + Buffer.from(authString).toString("base64");
};

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

async function createUser(userData) {
  const {
    username,
    password,
    email,
    firstName,
    lastName,
    country,
    accountType,
    businessName,
    dateOfBirth,
    mobile,
  } = userData;
  console.log(`Creating ${accountType} user`)

  const token = await getAccessToken();

  const response = await axios.post(
    `${ASGARDEO_BASE_URL_SCIM2}/Users`,
    {
      schemas: [],
      userName: `${userStoreName}/${username}`,
      password: password,
      emails: [
        {
          value: email,
          primary: true,
        },
      ],
      name: {
        givenName: firstName,
        familyName: lastName,
      },
      "urn:scim:wso2:schema": {
        country: country,
        dateOfBirth: dateOfBirth,
      },
      phoneNumbers: [
        {
          type: "mobile",
          value: mobile,
        },
      ],
      "urn:scim:schemas:extension:custom:User": {
        accountType: accountType,
        ...(businessName ? { businessName } : {}), 
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      httpsAgent: agent, // Attach the custom agents
    }
  );
  return response;
};

async function isBusinessNameAvailable(businessName) {

  console.log(`Checking if business name ${businessName} is available`)
  const token = await getAccessToken();

  const response = await axios.post(
    `${ASGARDEO_BASE_URL}/api/server/v1/organizations/check-name`,
    { name: businessName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      httpsAgent: agent,
    }
  );

  return response.data.available;
}

async function createOrganization(businessName, creatorId, creatorUsername) {

  const token = await getAccessToken();

  const response = await axios.post(
    `${ASGARDEO_BASE_URL}/api/server/v1/organizations`,
    {
      name: businessName,
      attributes: [
        { key: "creator.id", value: creatorId },
        { key: "creator.username", value: creatorUsername },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      httpsAgent: agent,
    }
  );

  return response;
}

async function getUserIdInOrganization(organizationId, username) {

  const token = await getOrganizationToken(organizationId);

  const response = await axios.get(
    `${ASGARDEO_BASE_URL}/o/scim2/Users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      params: {
          filter: `userName eq ${username}`,
        },
      httpsAgent: agent,
    }
  );

  const resources = response.data.Resources || [];
  if (resources.length === 0) {
    throw new Error("User not found in organization");
  }
  return resources[0].id;
}

async function getAdminRoleIdInOrganization(organizationId) {

  const token = await getOrganizationToken(organizationId);

  const response = await axios.get(
    `${ASGARDEO_BASE_URL}/o/scim2/v2/Roles`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      params: {
          filter: `displayName eq Business Administrator`,
        },
      httpsAgent: agent,
    }
  );
  const resources = response.data.Resources || [];
  if (resources.length === 0) {
    throw new Error("Admin role not found in organization");
  }
  return resources[0].id;
}

async function addUserToAdminRole(organizationId, roleId, userId) {
  const token = await getOrganizationToken(organizationId);

  const response = await axios.patch(
    `${ASGARDEO_BASE_URL}/o/scim2/v2/Roles/${roleId}`,
    {
      Operations: [
        {
          op: "add",
          path: "users",
          value: [
            {
              value: userId,
            },
          ],
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      httpsAgent: agent, // Attach the custom agents
    }
  );

  return response.data;
}

app.post("/signup", async (req, res) => {
  try {
    const response = await createUser(req.body);
    res.json({ message: "User registered successfully", data: response.data });
  } catch (error) {
    console.log("SCIM2 API Error:", error.detail || error.message);
    res.status(400).json({ error: error.detail || "Signup failed" });
  }
});

app.post("/business-signup", async (req, res) => {
  try {
    const { businessName } = req.body;
    const { username } = req.body;

    const available = await isBusinessNameAvailable(businessName);
    if (!available) {
      return res.status(400).json({ error: "Business name is already taken" });
    }

    const userResponse = await createUser(req.body);
    // Return a response and asynchronously continue with the remaining operations
    res.json({
      message: "Business user registered successfully",
      user: userResponse.data
    });

    const creatorId = userResponse.data.id;
    const orgResponse = await createOrganization(businessName, creatorId, username);
    const organizationId = orgResponse.data.id;
    
    const orgUserId = await getUserIdInOrganization(organizationId, username);
    const adminRoleId = await getAdminRoleIdInOrganization(organizationId);
    addUserToAdminRole(organizationId, adminRoleId, orgUserId);
  } catch (error) {
    console.log(error)
    console.error("Business signup error:", error.message);
    res.status(400).json({ error: "Business signup failed" });
  }
});

// Get a new token if expired or not available
const getAccessToken = async () => {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

  if (
    tokenData.access_token &&
    tokenData.expires_at &&
    currentTime < tokenData.expires_at
  ) {
    console.log(
      `Using cached access token. Expires in ${
        tokenData.expires_at - currentTime
      } seconds.`
    );
    return tokenData.access_token;
  }

  console.log("Fetching new access token... ");

  try {
    const response = await axios.post(
      TOKEN_ENDPOINT,
      "grant_type=client_credentials&scope=internal_user_mgt_create internal_user_mgt_delete internal_user_mgt_update internal_user_mgt_view internal_organization_create internal_organization_view internal_organization_update internal_organization_delete",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: getAuthHeader(),
        },
        httpsAgent: agent, // Attach the custom agent
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

    console.log(
      `New access token received. Expires at ${new Date(
        tokenData.expires_at * 1000
      ).toISOString()}`
    );
    return tokenData.access_token;
  } catch (error) {
    console.log("Error fetching token:", error);
    throw new Error("Failed to get access token");
  }
};

const getOrganizationToken = async (switchingOrganizationId) => {
  
  const currentTime = Math.floor(Date.now() / 1000);
  if (
    orgTokenCache[switchingOrganizationId] &&
    orgTokenCache[switchingOrganizationId].access_token &&
    orgTokenCache[switchingOrganizationId].expires_at &&
    currentTime < orgTokenCache[switchingOrganizationId].expires_at
  ) {
    console.log(
      `Using cached token for org ${switchingOrganizationId}. Expires in ${
        orgTokenCache[switchingOrganizationId].expires_at - currentTime
      } seconds.`
    );
    return orgTokenCache[switchingOrganizationId].access_token;
  }

  try {
    const rootToken = await getAccessToken();

    console.log(`Fetching new switch token for organization ${switchingOrganizationId}... `);

    const params = new URLSearchParams();
    params.append("grant_type", "organization_switch");
    params.append("token", rootToken);
    params.append("switching_organization", switchingOrganizationId);
    params.append(
      "scope",
      "internal_org_role_mgt_view internal_org_role_mgt_update internal_org_user_mgt_create internal_org_user_mgt_list internal_org_user_mgt_view"
    );

    const response = await axios.post(
      TOKEN_ENDPOINT,
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: getAuthHeader(),
        },
        httpsAgent: agent,
      }
    );

    const expiresIn = response.data.expires_in; // in seconds
    const issuedAt = Math.floor(Date.now() / 1000);

    orgTokenCache[switchingOrganizationId] = {
      access_token: response.data.access_token,
      expires_at: issuedAt + expiresIn,
    };

    console.log(
      `New token cached for org ${switchingOrganizationId}. Expires at ${new Date(
        orgTokenCache[switchingOrganizationId].expires_at * 1000
      ).toISOString()}`
    );

      return response.data.access_token;
  } catch (error) {
    console.log("Error fetching organization token:", error);
    throw new Error("Failed to get organization token");
  }
};


// IP geolocation request
app.post("/risk", async (req, res) => {
  try {
    let { ip, country } = req.body;

    if (!ip || !country) {
      return res
        .status(400)
        .json({ error: "IP address and country name are required" });
    }
    
    // Call the IP Geolocation API
    const response = await axios.get(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${GEO_API_KEY}&ip=${ip}&fields=country_name`
    );

    const country_name = response.data.country_name;
    // Determine risk based on country code
    const hasRisk = country_name !== country;
    console.log("This country shows risk: " + hasRisk);
    res.json({ hasRisk });
  } catch (error) {
    console.error("Error fetching IP geolocation:", error.message);
    res.status(500).json({ error: "Failed to process request" });
  }
});

app.delete("/close-account", async (req, res) => {
  try {
    const userId = req.query.userId;
    const token = await getAccessToken();

    const response = await axios.delete(
      `${ASGARDEO_BASE_URL_SCIM2}/Users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
        httpsAgent: agent, // Attach the custom agent
      }
    );
    if (response.status == 204) {
      res.json({
        message: "Account removed successfully",
        data: response.data,
      });
    }
  } catch (error) {
    console.log("SCIM2 API Error:", error.detail || error.message);
    res
      .status(400)
      .json({ error: error.detail || "An error occurred while deleting user" });
  }
});

app.listen(PORT, () =>
  console.log(`🌐 Server running at: http://${HOST}:${PORT}`)
);
