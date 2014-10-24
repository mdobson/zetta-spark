var Device = require('zetta-device');
var util = require('util');
var SparkWrapper = require('./lib/spark');

var Spark = module.exports = function(spark) {
  Device.call(this);
  this._spark = spark;
  this.coreId = this._spark.coreID;
  this._core = new SparkWrapper(spark);
};
util.inherits(Spark, Device);

Spark.prototype.init = function(config) {
  config
    .type('spark')
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
  this._core.describe(function(err, event, results) {
    self.functions = results.state.f;
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

