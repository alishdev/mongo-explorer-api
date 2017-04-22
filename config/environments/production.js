// config/environment/production.js
var nconf = require('nconf');
nconf.set('swagger', {
  host: 'dry-spire-23794.herokuapp.com'
});

nconf.set('http', {
  port: 4000
});