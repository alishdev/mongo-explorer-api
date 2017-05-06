// to run test type
// npm test

'use strict';
var MongoClient = require('mongodb').MongoClient;
var expect = require('chai').expect;
var config = require('nconf');
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

var nconf = require('nconf');
require('dotenv').load();
nconf.use('memory');
nconf.argv();
nconf.env();
require('../config/environments/' + nconf.get('TEST_ENV'));

const apihost = config.get('test-http:host');
const apiport = config.get('test-http:port');
const baseUrl = `http://${apihost}:${apiport}`; 
console.log(baseUrl);

const dbhost = config.get('test-db:host');
const dbport = config.get('test-db:port');
const dbuser = config.get('test-db:user');
const dbpassword = config.get('test-db:password');
const dbssl = config.get('test-db:ssl');
console.log(`dbhost = ${dbhost}`);
console.log(`dbport = ${dbport}`);
console.log(`dbuser = ${dbuser}`);
console.log(`dbpassword = ${dbpassword}`);
console.log(`dbssl = ${dbssl}`);

describe('get all dbs', function(){
    // it('status Ok', function(done){
    //     chai.request(baseUrl)
    //         .get('/api/db')
    //         .set('mongo-server', dbhost)
    //         .set('mongo-server-port', dbport)
    //         .set('mongo-server-user', dbuser)
    //         .set('mongo-server-password', dbpassword)
    //         .end(function(error, res) {
    //             if (error)
    //                 done(error);
    //             else
    //             {
    //                 expect(res.statusCode).to.equal(200);
    //                 done();
    //             }
    //         });
    //     });

    // it('db count must be 2', function(done){
    //     chai.request(baseUrl)
    //         .get('/db')
    //         .set('mongo-server', dbhost)
    //         .set('mongo-server-port', dbport)
    //         .set('mongo-server-user', dbuser)
    //         .set('mongo-server-password', dbpassword)
    //         .end(function(error, res) {
    //             if (error)
    //                 done(error);
    //             else
    //             {
    //                 var bodyObj = res.body;
    //                 expect(bodyObj.length).to.equal(2);
    //                 console.log(bodyObj);
    //                 done();
    //             }
    //         });
    // });

    it('crunchbase db must exist', function(done){
        chai.request(baseUrl)
            .get('/api/db/Logs')
            .set('mongo-server', dbhost)
            .set('mongo-server-port', dbport)
            .set('mongo-server-user', dbuser)
            .set('mongo-server-password', dbpassword)
            .set('mongo-server-ssl', dbssl)
            .end(function(error, res) {
                if (error)
                    done(error);
                else
                {
                    var bodyObj = res.body;
                    expect(bodyObj.name).to.equal('Logs');
                    expect(bodyObj.collections.length).to.gte(0);
                    done();
                }
            });
    });
});