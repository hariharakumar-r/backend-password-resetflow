require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

app.use("/api/auth", require("./routes/auth"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() =>
    app.listen(process.env.PORT, () => console.log(`Server running...`))
  )
  .catch((err) => console.log(err));
