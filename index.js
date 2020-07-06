if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/react-router-config-upgrade.min.js");
} else {
  module.exports = require("./cjs/react-router-config-upgrade.js");
}
