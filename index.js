if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/gap-react-router.min.js");
} else {
  module.exports = require("./cjs/gap-react-router.js");
}
