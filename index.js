require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const router = require("./chatRoute");

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/twiliochat", (err) => {
  if (err) {
    console.log("Error in connecting DB");
  } else {
    console.log("Connected to DB");
  }
});

app.use("/api/v1", router);

app.listen(4000, () => {
  console.log("Server started on Port 4000");
});
