const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

//creating Express Application
const app = express();
app.use(bodyParser.json());

// Add middleware to parse JSON
app.use(
    cors({
      origin: ['http://localhost:5173', 'https://hariharakumar-password-reset.netlify.app'], // Explicitly specify your frontend origin
      credentials: true, // Allow cookies and other credentials to be sent
    })
  );

const allowedOrigins = [
  "http://localhost:5173",
  "https://hariharakumar-password-reset.netlify.app"
];

// List of allowed origins or use '*' for public APIs without credentials

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        // Allow requests from allowed origins or non-browser tools like Postman
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies and authentication credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  })
);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Ensure cookies are sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        // Allow requests from these origins or from tools like Postman
        callback(null, true);
      } else {
        // Reject requests from unknown origins
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,  // Allow cookies and credentials
  })
);
app.use(
  cors({
      origin: '*', // Use the deployed frontend URL for production
      credentials: true,
  })
);

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", authRouter);

//Listen Request
module.exports = app;
