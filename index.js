var DeviceServer = require('spark-protocol').DeviceServer;
var EventEmitter = require('events').EventEmitter;
var server = new DeviceServer({
  coreKeysDir: '.'
});

var emitter = new EventEmitter();

global.server = server;
var interval = setInterval(function(){
  var cores = global.server.getAllCores();
  var myCoreIds = Object.keys(cores);
  if(myCoreIds.length) {
    var myCore = cores[myCoreIds[0]];
    emitter.emit('device', myCore);
  }
}, 3000);

emitter.on('device', function(device){
  console.log('device online in user space');
  clearInterval(interval);
  device.onApiMessage('matt', { cmd:'Ping'});
  device.on('matt', function(sender, args) {
    console.log('Matt event');
  });
});
server.start();

