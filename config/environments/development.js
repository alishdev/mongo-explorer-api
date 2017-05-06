// config/environment/development.js
var nconf = require('nconf');
nconf.set('swagger', {
  host: 'localhost:4000'
});

nconf.set('http', {
  port: 4000,
  host: 'localhost'
});
