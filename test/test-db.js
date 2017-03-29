var expect = require('chai').expect;
var config = require('nconf');
var request = require('request');

var nconf = require('nconf');
require('dotenv').load();
nconf.use('memory');
nconf.argv();
nconf.env();
require('../config/environments/' + nconf.get('NODE_ENV'));

const baseUrl = "http://localhost:" + config.get('NODE_PORT');
console.log(config.get('NODE_PORT'));
console.log(baseUrl);

describe('get all dbs', function(){
    it('status Ok', function(done){
        request.get({url: baseUrl + "/db"}, function(error, response, body){
            if (error)
                done(error);
            else
            {
                expect(response.statusCode).to.equal(200);
                done();
            }
        });
    });

    it('db count must be 2', function(done){
        request.get({url: baseUrl + "/db"}, function(error, response, body){
            if (error)
                done(error);
            else
            {
                var bodyObj = JSON.parse(body);
                console.log(bodyObj);
                expect(bodyObj.length).to.equal(2);
                done();
            }
        });
        
    });
});