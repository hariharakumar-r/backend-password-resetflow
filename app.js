const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

//creating Express Application
const app = express();
app.use(bodyParser.json());


// app.post("/login", (req, res) => {
//   // ...authenticate user...
//   // If successful:
//   res.cookie("token", jwtToken, {
//     httpOnly: true,
//     secure: true, // use true in production
//     sameSite: "lax",
//     maxAge: 24 * 60 * 60 * 1000,
//   });
//   res.json({ message: "Login successful" });
// });

const allowedOrigins = [
  "http://localhost:5173",
  "https://hariharakumar-password-reset.netlify.app"
];

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

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", authRouter);

//Listen Request
module.exports = app;
