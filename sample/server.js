var zetta = require('zetta');
var Spark = require('../');

zetta()
  .name('SparkServer')
  .use(Spark)
  .listen(1337);
