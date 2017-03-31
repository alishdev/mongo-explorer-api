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
require('../config/environments/' + nconf.get('NODE_ENV'));

const baseUrl = "http://localhost:" + config.get('NODE_PORT');
// console.log(config.get('NODE_PORT'));
// console.log(baseUrl);

describe('get all dbs', function(){
    it('status Ok', function(done){
        chai.request(baseUrl)
            .get('/db')
            .set('mongo-server', 'localhost')
            .set('mongo-server-port', 27017)
            .end(function(error, res) {
                if (error)
                    done(error);
                else
                {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });

    it('db count must be 2', function(done){
        chai.request(baseUrl)
            .get('/db')
            .set('mongo-server', 'localhost')
            .set('mongo-server-port', 27017)
            .end(function(error, res) {
                if (error)
                    done(error);
                else
                {
                    var bodyObj = res.body;
                    expect(bodyObj.length).to.equal(2);
                    console.log(bodyObj);
                    done();
                }
            });
    });

    it('video db must exist', function(done){
        chai.request(baseUrl)
            .get('/db/video')
            .set('mongo-server', 'localhost')
            .set('mongo-server-port', 27017)
            .end(function(error, res) {
                if (error)
                    done(error);
                else
                {
                    var bodyObj = res.body;
                    expect(bodyObj.name).to.equal('video');
                    expect(bodyObj.collections.length).to.gte(0);
                    done();
                }
            });
    });
});