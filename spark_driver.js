var Device = require('zetta-device');
var util = require('util');

var Spark = module.exports = function(spark) {
  Device.call(this);
  this._spark = spark;
  this._listener = null;
  this._listenerKey = 'zetta';
  this.coreId = this._spark.coreID;
};
util.inherits(Spark, Device);

Spark.prototype.init = function(config) {
  config
    .type('spark')
    .name(this._spark.coreID)
    .state('online')
    .when('online', { allow: ['ping'] })
    .map('ping', this.ping);
};

Spark.prototype._sendMessage = function(message, cb) {
  var self = this;
  if(this._listener) {
    cb(new Error('Error communicating with Core. We are in a bad state.'));
  }

  this._listener = this._spark.once(this._listenerKey + message, function() {
//    self._spark.removeEventListener(self._listenerKey, self._listener);
    this._listener = null;
    var args = Array.prototype.slice.call(arguments);
    args.unshift(null);
    cb.apply(null, args);
  });
  
  this._spark.onApiMessage(this._listenerKey + message, { cmd: message });
}

Spark.prototype.ping = function(cb) {
  var self = this;
  this.state = 'pinging';
  this._sendMessage('Ping', function(err) {
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
