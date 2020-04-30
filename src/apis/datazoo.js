const axios = require("axios");
const cache = require("memory-cache");

axios.defaults.adapter = require("axios/lib/adapters/http");

const datazoo = axios.create({
  // baseURL: "http://localhost:5001",
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://rest.datazoo.com/api"
      : "https://resttest.datazoo.com/api",
});

const getNewAccessToken = async () => {
  const { data } = await datazoo.post("/Authenticate.json", {
    UserName: process.env.DATA_ZOO_USERNAME,
    Password: process.env.DATA_ZOO_PASSWORD,
  });
  //Store access token for 8 hours
  cache.put("ACCESS_TOKEN", data.sessionToken, 60 * 60 * 8);
  return data.sessionToken;
};

// Attach access token
datazoo.interceptors.request.use(
  async (config) => {
    if (config.url !== "/Authenticate.json")
      config.headers.SessionToken =
        cache.get("ACCESS_TOKEN") || (await getNewAccessToken());
    config.headers.username = process.env.DATA_ZOO_USERNAME;
    return config;
  },
  (e) => Promise.reject(e)
);

// Handle missing token
datazoo.interceptors.response.use(
  (res) => res,
  async (e) => {
    const original = e.response && e.response.config;
    if (
      !e.response ||
      e.response.status !== 403 ||
      original.url === "/Authenticate.json" ||
      original.__retry
    )
      throw e;

    const token = await getNewAccessToken();
    original.headers.SessionToken = token;
    original.__retry = true;
    return axios(original);
  }
);

module.exports = datazoo;
