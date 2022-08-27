require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const router = require("./chatRoute");
const welcome = require("./welcome");

app.use(express.json());

// mongoose.connect("mongodb://localhost:27017/twiliochat", (err) => {
//   if (err) {
//     console.log("Error in connecting DB");
//   } else {
//     console.log("Connected to DB");
//   }
// });

app.use("/", welcome);
app.use("/api/v1", router);

app.listen(process.env.PORT, () => {
  console.log(`Server started on Port ${process.env.PORT}`);
});
