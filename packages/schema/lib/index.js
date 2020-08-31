var Schema = require("./Schema");

module.exports = function plugin(backend, options) {
  var schema = new Schema(backend, options);

  backend.use("commit", schema.commitHandler);
};
