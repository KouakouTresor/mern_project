const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan")
require("dotenv/config")
const api = process.env.API_URL;
const productRoute = require("./routes/productRoute")
const categoryRoute = require("./routes/categoryRoute");
const orderRoute = require("./routes/orderRoute");
const userRoute = require("./routes/userRoute")

app.use(express.json())
app.use(morgan("tiny"));
app.use(`${api}/products`, productRoute);
app.use(`${api}/categories`, categoryRoute);
app.use(`${api}/orders`, orderRoute);
app.use(`${api}/users`, userRoute);


mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "tresorEshop"})
  .then(() => console.log("connection to DB"))
  .catch((err) => {
    console.log(err);
  }); 

app.get("/", (req, res) => {
  res.json("hello world");
});

app.listen(3000, () => {
  console.log("Hello world");
});
