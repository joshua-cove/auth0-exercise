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
  method: 'GET',
  uri: 'https://joshuacove.auth0.com/api/v2/users',
  qs: '',
  headers: headers,
  form: ''
};

// declare vars to use in tests
let first = '';
let second = '';
let third = '';

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

// All tests are followed by a 500ms sleep to avoid the free prod tenant rate limit of two calls per second.

describe('search users tests', function() {

  before(function() {
    // createUsers(2);
  });

  describe('/api/v2/users endpoint tests', function() {

    describe('auth tests', function() {

      tags('P1').it('should return 401 for requests without authorization header', function(done) {
        const options = Object.assign(opts, {headers:''});
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          expect(response.statusCode).to.equal(401);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('should return 401 for requests without authorization token', function(done) {
        const options = Object.assign(opts, {headers: {authorization: ''}});
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          expect(response.statusCode).to.equal(401);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('should return 401 for requests with invalid authorization token', function(done) {
        const invalid_token = `{authorization: ${token.slice(20, token.length)}}`
        const options = Object.assign(opts, {headers: invalid_token});
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          expect(response.statusCode).to.equal(401);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('should return 401 for requests with not found authorization token', function(done) {
        const not_found_token = `{authorization: ${token.slice(0, -1)+'a'}}`
        const options = Object.assign(opts, {headers: not_found_token});
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          expect(response.statusCode).to.equal(401);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('should return 401 for requests with invalid signature token', function(done) {
        const invalid_signature_token = `{authorization: ${token.slice(0, -1)}}`
        const options = Object.assign(opts, {headers: invalid_signature_token});
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          expect(response.statusCode).to.equal(401);
          sleep.msleep(500);
          done();
        });
      });

      it.skip('should return 401 for requests with client not global', function() {
        // skipping since this referce to deprecated APIs
      });

      it.skip('should return 403 for requests with insufficient scope', function() {
         // look into /dashboard/us/joshuacove/hooks
      });

      it.skip('should return 503 for timed out requests', function(done) {
        // haven't found a way to trigger timeouts
      });
    });

    describe('query parameter tests', function() {

      tags('P1').it('should return 400 for invalid query string', function(done) {
        var qs = {q: 'mail:"user*"', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs, headers: headers});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      // failing test just to show failure results are clearly logged
      tags('P3').it('should return 400 for "q" without "search_engine"', function(done) {
        var qs = {q: 'email:"user*"'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P2').it('should return 400 for invalid search engine value', function(done) {
        var qs = {q: 'email:"user*"', search_engine: 'v4'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('should return 400 for invalid v2 search syntax', function(done) {
        var qs = {q: 'email:"user*"', search_engine: 'v2'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('should return 400 for invalid v3 search syntax', function(done) {
        var qs = {q: 'name.raw:"jane"', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('returns the requested number of results for valid per_page value', function(done) {
        var qs = {per_page:2};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(JSON.parse(body).length).to.equal(2);
          sleep.msleep(500);
          done();
        });
      });

      tags('P2').it('returns all results when there are less than the per_page value', function(done) {
        var qs = {per_page:50, include_totals:true};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(JSON.parse(body).users.length).to.equal(JSON.parse(body).total);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('returns 400 for per_page > 100', function(done) {
        var qs = {per_page:101};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P2').it('returns 400 for per_page < 0', function(done) {
        var qs = {per_page:-1};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P2').it('returns 400 for per_page string value', function(done) {
        var qs = {per_page:'ten'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P2').it('returns 400 for per_page decimal value', function(done) {
        var qs = {per_page:2.2};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('returns empty array for page without per_page', function(done) {
        var qs = {page:2};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(JSON.parse(body).length).to.equal(0);
          done();
        });
      });

      // not a test, but was quicker than finding a way to save the email values within one test
      it('gets user emails', function(done) {
        var qs = {per_page:3, page:0};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          first = JSON.parse(body)[0].email;
          second = JSON.parse(body)[1].email;
          third = JSON.parse(body)[2].email;
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('returns requested page for valid page value', function(done) {
        var qs = {per_page:1, page:1};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(JSON.parse(body)[0].email).to.eq(second);
          expect(JSON.parse(body)[0].email).not.to.eq(first);
          expect(JSON.parse(body)[0].email).not.to.eq(third);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('returns 400 for > 1000 results', function(done) {
        var qs = {per_page:100, page:20};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P2').it('returns 400 for page value < 0', function(done) {
        var qs = {per_page:2, page:-1};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P2').it('returns 400 for page string value', function(done) {
        var qs = {per_page:2, page:'two'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P2').it('returns 400 for page decimal value', function(done) {
        var qs = {per_page:2, page:2.2};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('returns totals when include_totals is true', function(done) {
        var qs = {include_totals:true, per_page:1};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(JSON.parse(body)).to.have.property('start');
          expect(JSON.parse(body)).to.have.property('limit');
          expect(response.statusCode).to.equal(200);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('doesnt return totals when include_totals is false', function(done) {
        var qs = {include_totals:false, per_page:1};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(JSON.parse(body)).not.to.have.property('start');
          expect(JSON.parse(body)).not.to.have.property('limit');
          expect(response.statusCode).to.equal(200);
          sleep.msleep(500);
          done();
        });
      });

      tags('P2').it('returns 400 when include_totals has integer value', function(done) {
        var qs = {include_totals:2, per_page:1};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P2').it('returns 400 when include_totals has string value', function(done) {
        var qs = {include_totals:"two", per_page:1};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('returns 200 for valid sort field names', function(done) {
        var qs = {sort:'email:1'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('returns 400 for invalid sort field names', function(done) {
        var qs = {sort:'"email":1'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('sorts ascending for field:1', function(done) {
        var qs = {sort:'email:1'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          const first = JSON.parse(body)[0].email
          const last = JSON.parse(body).pop().email
          expect(first < last).to.be.true;
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('sorts descending for field:-1', function(done) {
        var qs = {sort:'email:-1'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          const first = JSON.parse(body)[0].email
          const last = JSON.parse(body).pop().email
          expect(first > last).to.be.true;
          sleep.msleep(500);
          done();
        });
      });

      tags('P2').it('returns 400 for invalid sort order', function(done) {
        var qs = {sort:'email:2'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('returns 200 for valid field values passed to fields', function(done) {
        var qs = {fields:'email', include_fields:true};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('returns 400 for invalid field values passed to fields', function(done) {
        var qs = {fields:'%$!', include_fields:true};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('returns requested field when include_fields: true', function(done) {
        var qs = {fields:'email', include_fields:true};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(JSON.parse(body)[0].email).to.exist;
          expect(JSON.parse(body)[0].username).not.to.exist;
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('doesnt return requested field when include_fields: false', function(done) {
        var qs = {fields:'email', include_fields:false};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(JSON.parse(body)[0].email).not.to.exist;
          expect(JSON.parse(body)[0].username).to.exist;
          sleep.msleep(500);
          done();
        });
      });
    });

    describe('custom query tests', function() {

      tags('P1').it('search by email succeeds', function(done) {
        var qs = {q: 'email:user*', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body)[0].email).to.include('user');
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('search by user_id succeeds', function(done) {
        var qs = {q: 'user_id:*5d7c*', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body)[0].user_id).to.include('5d7c');
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('search by existing user email returns the user', function(done) {
        var qs = {q: `${first}`, search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body)[0].email).to.include(`${first}`);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('search by non-existing user email returns empty array', function(done) {
        var qs = {q: 'email:notauser*', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.eq(0);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('search by partial email prefix returns the user', function(done) {
        var qs = {q: 'email:user*', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body)[0].email).to.include('user');
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('search by partial email suffix returns the user', function(done) {
        var qs = {q: 'email:*test.com', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body)[0].email).to.include('test.com');
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('search by partial email returns multiple existing matches', function(done) {
        var qs = {q: 'email:*test.com', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.be.gt(1);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it.skip('search by phone_number succeeds', function(done) {
        // enabling the SMS connection seemed too complex for this scope
      });

      tags('P1').it.skip('search by phone_verified succeeds', function(done) {
        // requires the phone_number via SMS connection
      });

      tags('P1').it('search by logins_count succeeds', function(done) {
        var qs = {q: 'logins_count:1', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.eq(1);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('search by created_at succeeds', function(done) {
        var qs = {q: 'created_at:[2019-09-13T15:44:36.676Z TO 2019-09-14T15:44:36.676Z]', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.be.gt(1);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('search by updated_at succeeds', function(done) {
        var qs = {q: 'updated_at:[2019-09-13T15:44:36.676Z TO 2019-09-14T15:44:36.676Z]', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.be.gt(1);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('search by last_login succeeds', function(done) {
        var qs = {q: 'last_login:[2019-09-13T15:44:36.676Z TO 2019-09-14T15:44:36.676Z]', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.eq(1);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it.skip('search by last_ip succeeds', function(done) {
        // skipping for now, just more of the same type of test
      });

      tags('P1').it.skip('search by blocked succeeds', function(done) {
        // skipping for now, just more of the same type of test
      });

      tags('P1').it.skip('search by email_domain succeeds', function(done) {
        // skipping for now, just more of the same type of test
      });

      tags('P1').it.skip('search by boolean metadata succeeds', function(done) {
        // skipping for now, just more of the same type of test
      });

      tags('P1').it.skip('search by integer metadata succeeds', function(done) {
        // skipping for now, just more of the same type of test
      });

      tags('P1').it.skip('search by text metadata succeeds', function(done) {
        // skipping for now, just more of the same type of test
      });

      tags('P1').it.skip('search by object nested text metadata succeeds', function(done) {
        // skipping for now, just more of the same type of test
      });

      tags('P1').it.skip('search by array nested text metadata succeeds', function(done) {
        // skipping for now, just more of the same type of test
      });
    });

    describe('exact and wildcard searches', function() {

      tags('P1').it('search by exact name succeeds and returns matching result', function(done) {
        var qs = {q: 'name:Myrtis Yost', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.eq(1);
          expect(JSON.parse(body)[0].name).to.eq('Myrtis Yost');
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('search by exact name succeeds and returns no matching result', function(done) {
        var qs = {q: 'name:Joshua Cove', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.eq(0);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('search by first initial and wildcard succeeds and returns matching results', function(done) {
        var qs = {q: 'name:M*', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.gt(1);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('search by first initial and wildcard succeeds and returns no matching results', function(done) {
        var qs = {q: 'name:X*', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.eq(0);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('search by wildcard and last letter returns a 400 error', function(done) {
        var qs = {q: 'name:*M', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      tags('P1').it('search by wildcard and last two letters returns a 400 error', function(done) {
        var qs = {q: 'name:*st', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('search by wildcard and last three letters returns a 400 error', function(done) {
        var qs = {q: 'name:*ost', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.eq(1);
          expect(JSON.parse(body)[0].name).to.eq('Myrtis Yost');
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('search by wildcard and last three letters returns a 400 error', function(done) {
        var qs = {q: 'name:*xyz', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.eq(0);
          sleep.msleep(500);
          done();
        });
      });
    });

    describe('range searches', function() {

      tags('P2').it('range searches on text fields return 400 error', function(done) {
        var qs = {q: 'name:[A TO Z]', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P2').it('range searches on boolean fields return 400 error', function(done) {
        var qs = {q: 'blocked:[true TO false]', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P2').it('range searches on metadata fields return 400 error', function(done) {
        var qs = {q: 'myMetaField:[2019-09-13T15:44:36.676Z TO 2019-09-14T15:44:36.676Z]', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('range searches on date fields succeed', function(done) {
        var qs = {q: 'created_at:[2019-09-13T15:44:36.676Z TO 2019-09-14T15:44:36.676Z]', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          sleep.msleep(500);
          done();
        });
      });

      it('gets users for boundary tests', function(done) {
        var qs = {per_page:3, page:0, sort:'created_at:1'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          first = JSON.parse(body)[0];
          second = JSON.parse(body)[1];
          third = JSON.parse(body)[2];
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('range searches include [ opening boundary', function(done) {
        var qs = {q: `created_at:[${first.created_at} TO ${third.created_at}]`, sort:'created_at:1', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body)[0].email).to.eq(`${first.email}`);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('range searches exclude { opening boundary', function(done) {
        var qs = {q: `created_at:{${first.created_at} TO ${third.created_at}]`, sort:'created_at:1', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body)[0].email).to.eq(`${second.email}`);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('range searches include ] closing boundary', function(done) {
        var qs = {q: `created_at:[${first.created_at} TO ${third.created_at}]`, sort:'created_at:1', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).pop().email).to.eq(`${third.email}`);
          sleep.msleep(500);
          done();
        });
      });

      tags('P1').it('range searches exclude } closing boundary', function(done) {
        var qs = {q: `created_at:[${first.created_at} TO ${third.created_at}}`, sort:'created_at:1', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).pop().email).to.eq(`${second.email}`);
          sleep.msleep(500);
          done();
        });
      });
    });
  });
});
