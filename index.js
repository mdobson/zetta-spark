var Scout = require('zetta-scout');
var util = require('util');
var ProtocolServer = require('spark-protocol-server');
var Spark = require('./spark_driver');
var AnalogPin = require('./analog_pin_driver');
var DigitalPin = require('./digital_pin_driver');

var digitalPins = ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
var analogPins = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'];

var SparkScout = module.exports = function() {
  Scout.call(this);
  this.protocolServer = new ProtocolServer();
};
util.inherits(SparkScout, Scout);

SparkScout.prototype.init = function(next) {
  var self = this;
  this.protocolServer.on('device', function(core) {
    var hexId = core.coreID;
    var coreQuery = self.server.where({ type: 'spark', coreId: hexId });
    self.server.find(coreQuery, function(err, results) {
      //Core ids are unique. We're making a big assumption here, but that's okay.
      var result = results[0];
      if(err) {
        console.log(err);
      }

      if(result) {
        self.provision(result, Spark, core);
      } else {
        self.discover(Spark, core);
      }
      self._allocatePins(core);
    });

  });
  this.protocolServer.start();
  next();
};

SparkScout.prototype._allocatePins = function(core) {
  var self = this;
  var hexId = core.coreID;
  digitalPins.forEach(function(pin) {
    var pinQuery = self.server.where({ type: 'core-digital-pin', pin: pin, coreId: hexId });
    self.server.find(pinQuery, function(err, results) {
      var result = results[0];
      if(result) {
        self.provision(result, DigitalPin, pin, core);
      } else {
        self.discover(DigitalPin, pin, core);
      }
    });
  });

  analogPins.forEach(function(pin) {
    var pinQuery = self.server.where({ type: 'core-analog-pin', pin: pin, coreId: hexId });
    self.server.find(pinQuery, function(err, results) {
      var result = results[0];
      if(result) {
        self.provision(result, AnalogPin, pin, core);
      } else {
        self.discover(AnalogPin, pin, core);
      }
    });
  });
};
