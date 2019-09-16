var chai = require("chai");
var expect = chai.expect;
var loadtest = require("loadtest");
var sleep = require('sleep');
var tags = require('mocha-tags');
var configs = require('../support/configs.js');
const token = configs.token;
const headers = {Authorization: `${token}`, Accept: 'application/json'};

describe('concurrency test', function() {
  tags('P1').it('should return 429 for concurrent requests', function(done) {
    var errors = [];
    function statusCallback(error, result, latency) {
        if (error) {
          errors.push(error);
        }
    }
    const options = {
        url: 'https://joshuacove.auth0.com/api/v2/users',
        maxRequests: 50,
        concurrency: 10,
        maxSeconds: 1,
        headers: headers,
        requestsPerSecond: 50,
        statusCallback: statusCallback
    };
    loadtest.loadTest(options, function(error, result) {
      if (error) {
        return console.error('Got an error: %s', error);
      }
      expect(errors).to.deep.include('Status code 429');
      sleep.msleep(1000);
      done();
    });
  });
});
