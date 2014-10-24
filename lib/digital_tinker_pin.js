var Shim = require('./core_shim');

var DigitalTinkerPin = module.exports = function(core) {
  this._shim = new Shim(core);
};

DigitalTinkerPin.prototype.digitalWrite = function(pin, state, cb) {
  var self = this;
  var args = [[pin, state].join(',')];
  this._shim.sendMessage('CallFn', 'digitalwrite', args, function(err, event, results) {
    cb(err, results.result);
  });
};

DigitalTinkerPin.prototype.digitalRead = function(pin, cb) {
  var args = [pin];
  this._shim.sendMessage('CallFn', 'digitalread', args, function(err, event, results){
    cb(err, results.result);
  });
};

