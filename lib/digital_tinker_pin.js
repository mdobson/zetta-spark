var Shim = require('./core_shim');

var DigtalTinkerPin = module.exports = function(core) {
  this._shim = new Shim(core);
};

Tinker.prototype.digitalWrite = function(pin, state, cb) {
  var self = this;
  var args = [[pin, state].join(',')];
  this.shim.sendMessage('CallFn', 'digitalwrite', args, cb);
};

Tinker.prototype.digitalRead = function(pin, cb) {
  var args = [pin];
  this._sendMessage('CallFn', 'digitalread', args, cb);
};

