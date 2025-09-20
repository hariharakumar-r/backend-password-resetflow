const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

//creating Express Application
const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://hariharakumar-password-reset.netlify.app",'https://frontend-password-resetflow.vercel.app'],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Add this line
  })
);



app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", authRouter);

//Listen Request
module.exports = app;
