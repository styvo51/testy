const NodeCache = require("node-cache");

// stdTTL: time to live in seconds for every generated cache element.
const cache = new NodeCache({ stdTTL: 43200 });

module.exports = cache;
