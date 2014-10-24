var Shim = require('./core_shim');

var Spark = module.exports = function(core) {
  this._core = new Shim(core);
};

Spark.prototype.ping = function(cb) {
  var self = this;
  this._sendMessage('Ping', null, null, cb);
};

Spark.prototype.describe = function(cb) {
  var self = this;
  this._core.sendMessage('Describe', null, null, cb);
};
