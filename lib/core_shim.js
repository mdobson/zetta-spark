var CoreShim = module.exports = function(core) {
  this._core = core;
};

CoreShim.prototype.sendMessage = function(msg, name, args, cb) {
  var self = this;

  this._core.once(this._listenerKey + message, function() {
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
  this._core.onApiMessage(this._listenerKey + message, command);
};
