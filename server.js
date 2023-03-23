const express = require("express");
const sarima = require("./routes/sarima");
require("dotenv").config();

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/sarima", sarima);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
