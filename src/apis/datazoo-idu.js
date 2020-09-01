const axios = require("axios");
const cache = require("memory-cache");

axios.defaults.adapter = require("axios/lib/adapters/http");

const datazoo = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://idu.datazoo.com/api/v2"
      : "https://idu-test.datazoo.com/api/v2",
});

const getNewAccessToken = async () => {
  const { data } = await datazoo.post("/auth/sign_in", {
    UserName: process.env.DATA_ZOO_USERNAME,
    Password: process.env.DATA_ZOO_PASSWORD,
  });
  //Store access token for 8 hours
  cache.put("ACCESS_TOKEN", data.sessionToken, 28800);
  return data.sessionToken;
};

// Attach access token
datazoo.interceptors.request.use(
  async (config) => {
    if (config.url !== "/auth/sign_in")
      config.headers.authorization =
        cache.get("ACCESS_TOKEN") || (await getNewAccessToken());
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
      original.url === "/auth/sign_in" ||
      original.__retry
    )
      throw e;

    const token = await getNewAccessToken();
    original.headers.authorization = token;
    original.__retry = true;
    return axios(original);
  }
);

module.exports = datazoo;
