// config/environment/test.js
// test config for mocha
var nconf = require('nconf');

nconf.set('test-http', {
  port: 4000,
  host: 'localhost'
});

//local db
nconf.set('test-db', {
  host:'localhost',
  port: 27017,
});
