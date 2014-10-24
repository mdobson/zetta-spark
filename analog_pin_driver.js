var Device = require('zetta-device');
var util = require('util');
var AnalogTinkerPin = require('./lib/analog_tinker_pin');

var AnalogPin = module.exports = function(pin, core) {
  Device.call(this);
  this.pin = pin;
  this._core = core;
  this._tinker = new AnalogTinkerPin(core);
}
util.inherits(AnalogPin, Device);

AnalogPin.prototype.init = function(config) {
  config
    .type('core-analog-pin')
    .name('core-' + this._core.coreID + '-analog-' + this.pin)
    .state('LOW')
    .when('LOW', { allow: ['analogRead', 'analogWrite'] })
    .when('HIGH', { allow: ['analogRead', 'analogWrite'] })
    .map('analogRead', this.analogRead)
    .map('analogWrite', this.analogWrite)
};

AnalogPin.prototype.analogRead = function() {


};

AnalogPin.prototype.analogWrite = function() {

};
