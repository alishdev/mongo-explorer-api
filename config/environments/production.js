// config/environment/production.js
var nconf = require('nconf');
nconf.set('url', 'https://dry-spire-23794.herokuapp.com');

nconf.set('database', {
  user: 'username',
  password: 'password',
  server: 'url'
});