var Scout = require('zetta-scout');
var util = require('util');
var ProtocolServer = require('spark-protocol-server');
var Spark = require('./spark_driver');

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
    });

  });
  this.protocolServer.start();
  next();
};
