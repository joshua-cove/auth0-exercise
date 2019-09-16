var faker = require('faker');
var request = require("request");
// require('request').debug = true
var chai = require("chai");
var expect = chai.expect;
var tags = require('mocha-tags');
var sleep = require('sleep');
var user_factory  = require('../support/user_factory');
var makeUser = user_factory.makeUser;
var configs = require('../support/configs.js');
const token = configs.token;
const headers = {Authorization: `${token}`, Accept: 'application/json'};

// opts used as the base options in API requests
var opts = {
  uri: 'https://joshuacove.auth0.com/api/v2/users-by-email',
  qs: '',
  headers: headers
};

// declare vars to use in tests
let first = 'user1@test.com';

// utility function to populate user data
function createUsers(n) {
  var body = makeUser();
  const options = Object.assign(opts, {method:'', form: body, headers: headers});
  var i = 0;
  for (i = 0; i < n; i++) {
    request.post(options, function (error, response, body) {
      if (error) throw new Error(error);
    });
  }
}

describe('search by email endpoint', function() {

  describe('searches', function() {

    tags('P1').it('search succeeds and returns a 200 for valid email', function(done) {
      var qs = {email: first};
      const options = Object.assign(opts, {qs: qs});
      console.log(options);
      console.log(qs);
      console.log(first);
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(JSON.parse(body)[0].email).to.eq(first);
        sleep.msleep(500);
        done();
      });
    });

    tags('P2').it('search succeeds and returns a 200 with empty array for valid email with different case', function(done) {
      var qs = {email: first.toUpperCase()};
      const options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(JSON.parse(body).length).to.eq(0);
        sleep.msleep(500);
        done();
      });
    });

    tags('P1').it('search returns a 400 for invalid email', function(done) {
      var qs = {email: 'whatever'};
      const options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        sleep.msleep(500);
        done();
      });
    });

    tags('P1').it('search succeeds and returns a 200 with empty array for not found email', function(done) {
      var qs = {email: 'a@b.com'};
      const options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(JSON.parse(body).length).to.eq(0);
        sleep.msleep(500);
        done();
      });
    });
  });

  describe('query params', function() {

    tags('P2').it('returns 400 for invalid field values passed to fields', function(done) {
      var qs = {email: first, fields: 'not_a_field'};
      const options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        sleep.msleep(500);
        done();
      });
    });

    tags('P1').it('returns requested fields when include_fields is true', function(done) {
      var qs = {email: first, fields: 'email', include_fields:true};
      const options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(JSON.parse(body)[0].email).to.exist;
        expect(JSON.parse(body)[0].name).not.to.exist;
        sleep.msleep(500);
        done();
      });
    });

    tags('P1').it('returns non-requested fields when include_fields is false', function(done) {
      var qs = {email: first, fields: 'email', include_fields:false};
      const options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(JSON.parse(body)[0].email).not.to.exist;
        expect(JSON.parse(body)[0].name).to.exist;
        sleep.msleep(500);
        done();
      });
    });

    tags('P2').it('returns 400 when include_fields is not valid', function(done) {
      var qs = {email: first, fields: 'email', include_fields:'two'};
      const options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        sleep.msleep(500);
        done();
      });
    });
  });
});
