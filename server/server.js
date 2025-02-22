
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

const corsOptions = {
    origin: ['http://localhost:5173'],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
    credentials: true,
    enablePreflight: true
}
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.options('*', cors(corsOptions));

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

    const response = await axios.post(
      `${ASGARDEO_BASE_URL}/Users`,
      {
        schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
        userName: username,
        password: password,
        emailaddress: [{
          value: email,
          primary: true
          }
        ],
        name: {
          givenName: firstName,
          familyName: lastName
        },
        country: country,
        mobile: mobile,
        accountType: accountType,
        dateOfBirth: dateOfBirth
      },
      {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ message: "User registered successfully", data: {"test":"done"} });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.response?.data || "Signup failed" });
  }
});

app.listen(PORT, () => console.log(`🌐 Server running at: http://${HOST}:${PORT}`));
