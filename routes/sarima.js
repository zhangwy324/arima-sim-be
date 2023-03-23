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
      console.log("response data:", response.data);
      // if the response.data has a error field, it means the api has error
      if (response.data.error) {
        // for api input error
        // returns {error: [error message]}
        // note it is an array
        res.status(400).json({ error: response.data.error });
        return;
      }
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      console.log("error.message:", error.message);
      // for when api is down
      // the response format matches the one above
      res.status(500).json({ error: ["The server might be down"] });
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
