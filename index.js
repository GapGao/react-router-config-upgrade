if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/mage-router-config.min.js");
} else {
  module.exports = require("./cjs/mage-router-config.js");
}
