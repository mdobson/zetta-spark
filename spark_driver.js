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
    .when('online', { allow: ['ping', 'digitalWrite', 'digitalRead', 'analogRead', 'analogWrite'] })
    .map('digitalWrite', this.digitalWrite, [{name: 'pin', type: 'text'}, {name:'state', type:'text'}])
    .map('digitalRead', this.digitalRead, [{name: 'pin', type: 'text'}])
    .map('analogRead', this.analogRead, [{name: 'pin', type: 'text'}])
    .map('analogWrite', this.analogWrite, [{name: 'pin', type: 'text'}, {name: 'value', type:'text'}])
    .map('ping', this.ping);
};

Spark.prototype._sendMessage = function(message, name, args, cb) {
  var self = this;

  this._spark.once(this._listenerKey + message, function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(null);
    cb.apply(null, args);
  });
  var command = { cmd: message };
  if(args) {
    command.args = args;
  }

  if(args) {
    command.name = name;
  }

  console.log(command);
  this._spark.onApiMessage(this._listenerKey + message, command);
}

Spark.prototype.ping = function(cb) {
  var self = this;
  this.state = 'pinging';
  this._sendMessage('Ping', null, null, function(err) {
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

Spark.prototype.digitalWrite = function(pin, state, cb) {
  var self = this;
  var args = [[pin, state].join(',')];
  this.state = 'setting-pin';
  this._sendMessage('CallFn', 'digitalwrite', args, function(err, event, result) {
    console.log(err);
    self.state = 'online';
    if(result.result) {
      self[pin] = state;
    }
    if(cb) {
      cb();
    }
  });
};

Spark.prototype.digitalRead = function(pin, cb) {
  var self = this;
  var args = [pin];
  this.state = 'reading-pin';
  this._sendMessage('CallFn', 'digitalread', args, function(err, event, result) {
    self.state = 'online';
    self[pin] = result.result;
    if(cb) {
      cb();
    }
  });
};

Spark.prototype.analogRead = function(pin, cb) {
  var self = this;
  var args = [pin];
  this.state = 'reading-pin';
  this._sendMessage('CallFn', 'analogread', args, function(err, event, result) {
    self.state = 'online';
    self[pin] = result.result;
    if(cb) {
      cb();
    }
  });
};

Spark.prototype.analogWrite= function(pin, value, cb) {
  var self = this;
  var args = [[pin, state].join(',')];
  this.state = 'setting-pin';
  this._sendMessage('CallFn', 'analogwrite', args, function(err, event, result) {
    console.log(err);
    self.state = 'online';
    if(result.result) {
      self[pin] = state;
    }
    if(cb) {
      cb();
    }
  });
};
