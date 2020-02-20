var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

// Routers
var indexRouter = require("./routes/index");
var matchRouter = require("./routes/match");
const confirmRouter = require("./routes/confirm");

var app = express();

app.use(logger("dev"));
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
// app.use("/match", matchRouter);
app.use("/confirm", confirmRouter);

module.exports = app;
