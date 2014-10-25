var Device = require('zetta-device');
var util = require('util');
var SparkWrapper = require('spark-coap-js-client').Spark;

var Spark = module.exports = function(spark) {
  Device.call(this);
  this._spark = spark;
  this.coreId = this._spark.coreID;
  this._core = new SparkWrapper(spark);
};
util.inherits(Spark, Device);

Spark.prototype.init = function(config) {
  config
    .type('spark-tinker')
    .name('core-' + this._spark.coreID)
    .state('online')
    .when('online', { allow: ['ping', 'describe'] })
    .map('describe', this.describe)
    .map('ping', this.ping);
};

Spark.prototype.ping = function(cb) {
  var self = this;
  this.state = 'pinging';
  this._core.ping(function(err) {
    self.state = 'online';
    if(cb) {
      if(err) {
        cb(err);
      } else {
        cb();
      }
    }
  });
};

Spark.prototype.describe = function(cb) {
  var self = this;
  this.state = 'describing';
  this._core.describe(function(err, results) {
    self.functions = results.functions;
    self.variables = results.variables;
    self.state = 'online';
    if(cb) {
      if(err) {
        cb(err);
      } else {
        cb();
      }
    }
  });
};

