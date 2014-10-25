var Device = require('zetta-device');
var util = require('util');
var AnalogTinkerPin = require('spark-coap-js-client').AnalogPin;

var AnalogPin = module.exports = function(pin, core) {
  Device.call(this);
  this.pin = pin;
  this._core = core;
  this.value = 0;
  this.coreId = core.coreID;
  this._tinker = new AnalogTinkerPin(core);
}
util.inherits(AnalogPin, Device);

AnalogPin.prototype.init = function(config) {
  config
    .type('core-analog-pin')
    .name('core-' + this._core.coreID + '-analog-' + this.pin)
    .state('online')
    .when('online', { allow: ['analogRead', 'analogWrite'] })
    .map('analogRead', this.analogRead)
    .map('analogWrite', this.analogWrite, [{type: 'text', name: 'pinstate'}])
    .monitor('value');
};

AnalogPin.prototype.analogRead = function(cb) {
  var self = this;
  this._tinker.analogRead(this.pin, function(err, result) {
    if(err) {
      if(cb) {
        cb(err);
      } else {
        self.log(err);
      }
    } else {
      self.value = result;
      if(cb) {
        cb();
      }
    }
  });

};

AnalogPin.prototype.analogWrite = function(pinstate, cb) {
  var self = this;
  this._tinker.analogWrite(this.pin, function(err, result) {
    if(err) {
      if(cb) {
        cb(err);
      } else {
        self.log(err);
      }
    } else {
      self.value = pinstate;
      if(cb) {
        cb();
      }
    }
  });
};
