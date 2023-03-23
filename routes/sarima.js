const axios = require("axios");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ msg: "GET sarimaApi" });
});

router.post("/", (req, res) => {
  const params = req.body;
  const cleanedParams = convertToNumberParams(params);
  const apiUrl = process.env.API_URL_DEPLOYED || "http://127.0.0.1:8000/sarima";
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: apiUrl,
    headers: {
      "Content-Type": "application/json",
    },
    data: cleanedParams,
  };
  axios(config)
    .then(function (response) {
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

// helper function
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
