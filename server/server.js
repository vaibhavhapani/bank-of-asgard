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


const ASGARDEO_BASE_URL = process.env.ASGARDEO_BASE_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const getAuthHeader = () => {
  const authString = `${CLIENT_ID}:${CLIENT_SECRET}`;
  return "Basic " + Buffer.from(authString).toString("base64");
};


app.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // const response = await axios.post(
    //   `${ASGARDEO_BASE_URL}/Users`,
    //   {
    //     schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
    //     userName: username,
    //     password: password,
    //     emails: [{ value: email, primary: true }],
    //   },
    //   {
    //     headers: {
    //       Authorization: getAuthHeader(),
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    res.json({ message: "User registered successfully", data: {"test":"done"} });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.response?.data || "Signup failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));