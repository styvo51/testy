// Use env var if available
require("dotenv").config();

// Ensure set node environment to test (jest does this if it's not set to something else)
process.env = { ...process.env, NODE_ENV: "test" };

// Export configuration
module.exports = {
  verbose: true
};
