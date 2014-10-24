var Shim = require('./core_shim');

var Tinker = module.exports = function(core) {
  this._core = new Shim(core);
};

Tinker.prototype.analogWrite = function(pin, state, cb) {
  var args = [[pin, state].join(',')];
  this._core.sendMessage('CallFn', 'analogwrite', args, function(err, event, results){
    cb(err, results.result);
  });
};

Tinker.prototype.analogRead = function(pin, cb) {
  var args = [pin];
  this._core.sendMessage('CallFn', 'analogread', args, function(err, event, results){
    cb(err, results.result);
  });
};
