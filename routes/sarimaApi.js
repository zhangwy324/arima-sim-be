const axios = require("axios");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ msg: "GET sarimaApi" });
});

router.post("/", (req, res) => {
  const params = req.body;
  const cleanedParams = convertToNumberParams(params);
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    // url: "http://127.0.0.1:6579/sarima",
    url: "https://arima-sim-api-production.up.railway.app/sarima",
    headers: {
      "Content-Type": "application/json",
    },
    data: cleanedParams,
  };
  axios(config)
    .then(function (response) {
      console.log(response.data);
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      if (!error.response) {
        res.status(500).json({ error: { error: "500 Server Error", message: "The server might be down" } });
        return;
      }
      res.status(500).json({ error: error.response.data });
    });
});

function convertToNumberParams(body) {
  for (const key in body) {
    if (typeof body[key] == "object") {
      body = {
        ...body,
        [key]: body[key].map((item) => +item),
      };
    } else if (typeof body[key] == "string") {
      body = {
        ...body,
        [key]: +body[key],
      };
    }
  }
  if (body.S === 0) {
    body.S = null;
  }
  return body;
}

module.exports = router;
