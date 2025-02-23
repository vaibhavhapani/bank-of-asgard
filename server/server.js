require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

const corsOptions = {
    origin: ['http://localhost:5173'],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
    credentials: true,
    enablePreflight: true
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions))

app.use(express.json());


const ASGARDEO_BASE_URL_SCIM2 = process.env.ASGARDEO_BASE_URL_SCIM2;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TOKEN_ENDPOINT=process.env.ASGARDEO_TOKEN_ENDPOINT;

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
    console.error("SCIM2 API Error:", error.detail || error.message);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));