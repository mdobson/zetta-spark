var Shim = require('./core_shim');

var Tinker = module.exports = function(core) {
  this._core = new Shim(core);
};

Tinker.prototype.analogWrite = function(pin, state, cb) {
  var args = [[pin, state].join(',')];
  this._sendMessage('CallFn', 'analogwrite', args, cb);

};

Tinker.prototype.analogRead = function(pin, cb) {
  var args = [pin];
  this._sendMessage('CallFn', 'analogread', args, cb);
};
