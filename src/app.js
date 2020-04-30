const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const api = require("./routes/api");
const app = express();

// jest --silent does not block logging
if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev"));
  app.use(helmet());
  app.use(morgan("combined"));
}
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", api);
app.get("*", (req, res) => res.status(404).send());

module.exports = app;
