var Device = require('zetta-device');
var util = require('util');
var DigitalTinkerPin = require('./lib/digital_tinker_pin');

var DigitalPin = module.exports = function(pin, core) {
  Device.call(this);
  this.pin = pin;
  this._core = core;
  this._tinker = new DigitialTinkerPin(core);
}
util.inherits(DigitalPin, Device);

DigitalPin.prototype.init = function(config) {
  config
    .type('core-digital-pin')
    .name('core-' + this._core.coreID + '-digital-' + this.pin)
    .state('LOW')
    .when('LOW', { allow: ['digitalRead', 'digitalWrite'] })
    .when('HIGH', { allow: ['digitalRead', 'digitalWrite'] })
    .map('digitalRead', this.digitalRead)
    .map('digitalWrite', this.digitalWrite, [{type: 'text', value: 'pinstate'}])
};

DigitalPin.prototype.digitalRead = function(cb) {
  this._tinker.digitalRead(this.pin, function(err, event, results) {
    
  });
};

DigitalPin.prototype.digitalWrite = function(pinstate, cb) {
  this._tinker.digitalWrite(this.pin, pinstate, function(err, event, results) {
    
  });
};
