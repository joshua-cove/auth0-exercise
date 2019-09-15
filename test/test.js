var faker = require('faker');
var request = require("request");
// require('request').debug = true
var chai = require("chai");
var expect = chai.expect;
var should = chai.should;
var loadtest = require("loadtest");
var user_factory  = require('./user_factory');
var makeUser = user_factory.makeUser;

let first;
let second;
let third;

const token = "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9UUXdNakpCUmtVMFJFSTNNekEzTkVGQ016TXlNRUV5UmpZMU5USXdRVVV6TVRReU5UUkNNdyJ9.eyJpc3MiOiJodHRwczovL2pvc2h1YWNvdmUuYXV0aDAuY29tLyIsInN1YiI6InZzWGlmSTV1NzNZcGM5UTJlcjQ2bzUxREdDTmhzRktNQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2pvc2h1YWNvdmUuYXV0aDAuY29tL2FwaS92Mi8iLCJpYXQiOjE1Njg0MjAzMDMsImV4cCI6MTU3MTAxMjMwMywiYXpwIjoidnNYaWZJNXU3M1lwYzlRMmVyNDZvNTFER0NOaHNGS00iLCJzY29wZSI6InJlYWQ6Y2xpZW50X2dyYW50cyBjcmVhdGU6Y2xpZW50X2dyYW50cyBkZWxldGU6Y2xpZW50X2dyYW50cyB1cGRhdGU6Y2xpZW50X2dyYW50cyByZWFkOnVzZXJzIHVwZGF0ZTp1c2VycyBkZWxldGU6dXNlcnMgY3JlYXRlOnVzZXJzIHJlYWQ6dXNlcnNfYXBwX21ldGFkYXRhIHVwZGF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgZGVsZXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOnJ1bGVzX2NvbmZpZ3MgdXBkYXRlOnJ1bGVzX2NvbmZpZ3MgZGVsZXRlOnJ1bGVzX2NvbmZpZ3MgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDp0ZW5hbnRfc2V0dGluZ3MgdXBkYXRlOnRlbmFudF9zZXR0aW5ncyByZWFkOmxvZ3MgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.XoBao8rtz-zfJlR5jf956bzqZbAhEt5baI8dlwwD52lOgQ9f6kvZoyIst9ANZP1aaeqyrJbgTQ5AJiEC3mYjPha5KO_krihcc1SxYK1j3w4TpO1nxJy2WDD0VPtcRw69CRtSgHI1WRMq-MKpze2dz9lp6a9KKwPOv7dSlt2OSOzPJMGlpgf1c4HH0ELKeuP7jizq8SOzs739X6jlJWsI9SLI7Oc1qxbnzGB4OEKK8IXOMtVypWpqeU2Oo9F6eGHf0Ol3HcEUm8ksNBYbzCy9JkL4Tp0Uf8HHvjX2S0NB4UmXTwtKElx24JUkQTTXV8xcODY4RFxcwHTjU8kBomfKnQ";
const headers = {Authorization: `${token}`, Accept: 'application/json'};

var opts = {
  method: 'GET',
  uri: 'https://joshuacove.auth0.com/api/v2/users',
  qs: '',
  headers: headers,
  form: ''
};

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

describe('search users tests', function() {

  describe('/api/v2/users endpoint tests', function() {

    describe('auth tests', function() {
      it.skip('should return 401 for requests without authorization header', function(done) {
        const options = Object.assign(opts, {headers:''});
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          expect(response.statusCode).to.equal(401);
          done();
        });
      });

      it.skip('should return 401 for requests without authorization token', function(done) {
        const options = Object.assign(opts, {headers: {authorization: ''}});
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          expect(response.statusCode).to.equal(401);
          done();
        });
      });

      it.skip('should return 401 for requests with invalid authorization token', function(done) {
        const invalid_token = `{authorization: ${token.slice(20, token.length)}}`
        const options = Object.assign(opts, {headers: invalid_token});
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          expect(response.statusCode).to.equal(401);
          done();
        });
      });

      it.skip('should return 401 for requests with not found authorization token', function(done) {
        const not_found_token = `{authorization: ${token.slice(0, -1)+'a'}}`
        const options = Object.assign(opts, {headers: not_found_token});
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          expect(response.statusCode).to.equal(401);
          done();
        });
      });

      it.skip('should return 401 for requests with invalid signature token', function(done) {
        const invalid_signature_token = `{authorization: ${token.slice(0, -1)}}`
        const options = Object.assign(opts, {headers: invalid_signature_token});
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          expect(response.statusCode).to.equal(401);
          done();
        });
      });

      it.skip('should return 401 for requests with client not global', function() {
        // skipping since this referce to deprecated APIs
      });

      it.skip('should return 403 for requests with insufficient scope', function() {
         // look into /dashboard/us/joshuacove/hooks
      });

      it.skip('should return 429 for concurrent requests', function(done) {
        var errors = [];
        function statusCallback(error, result, latency) {
            if (error) {
              errors.push(error);
            }
        }
        const options = {
            url: 'https://joshuacove.auth0.com/api/v2/users',
            maxRequests: 30,
            concurrency: 10,
            maxSeconds: 1,
            headers: headers,
            requestsPerSecond: 30,
            statusCallback: statusCallback
        };
        loadtest.loadTest(options, function(error, result) {
          if (error) {
            return console.error('Got an error: %s', error);
          }
          expect(errors).to.deep.include('Status code 429');
          done();
        });
      });

      it('should return 503 for timed out requests', function(done) {
        var qs = {q: 'app_metadata.subscription.plan:"gold"', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          console.log(body);
          expect(response.statusCode).to.equal(503);
          done();
        });
      });
    });

    describe('query parameter tests', function() {
      // before(function() {
      //   createUsers(2);
      // });

      it.skip('should return 400 for invalid query string', function(done) {
        var qs = {q: 'mail:"user*"', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs, headers: headers});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('should return 400 for "q" without "search_engine"', function(done) { // not sure where I read that, this does work
        var qs = {q: 'email:"user*"'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('should return 400 for invalid search engine value', function(done) {
        var qs = {q: 'email:"user*"', search_engine: 'v4'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('should return 400 for invalid v2 search syntax', function(done) {
        var qs = {q: 'email:"user*"', search_engine: 'v2'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('should return 400 for invalid v3 search syntax', function(done) {
        var qs = {q: 'name.raw:"jane"', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('returns the requested numnber of results for valid per_page value', function(done) {
        var qs = {per_page:2};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(JSON.parse(body).length).to.equal(2);
          done();
        });
      });

      it.skip('returns all results when there are less than the per_page value', function(done) {
        var qs = {per_page:50};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(JSON.parse(body).length).to.equal(19); // need to find a way to get the total count and calculate the last page
          done();
        });
      });

      it.skip('returns 400 for per_page > 100', function(done) {
        var qs = {per_page:101};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('returns 400 for per_page < 0', function(done) {
        var qs = {per_page:-1};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('returns 400 for per_page string value', function(done) {
        var qs = {per_page:'ten'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('returns 400 for per_page decimal value', function(done) {
        var qs = {per_page:2.2};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('returns empty array for page without per_page', function(done) {
        var qs = {page:2};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(JSON.parse(body).length).to.equal(0);
          done();
        });
      });

      // not a test, but was quicker than finding a way to save the email values within one test
      it.skip('gets user emails', function(done) {
        var qs = {per_page:3, page:0};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          first = JSON.parse(body)[0].email;
          second = JSON.parse(body)[1].email;
          third = JSON.parse(body)[2].email;
          done();
        });
      });

      it.skip('returns requested page for valid page value', function(done) {
        var qs = {per_page:1, page:1};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(JSON.parse(body)[0].email).to.eq(second);
          expect(JSON.parse(body)[0].email).not.to.eq(first);
          expect(JSON.parse(body)[0].email).not.to.eq(third);
          done();
        });
      });

      it.skip('returns 400 for > 1000 results', function(done) {
        var qs = {per_page:100, page:20};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('returns 400 for page value < 0', function(done) {
        var qs = {per_page:2, page:-1};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('returns 400 for page string value', function(done) {
        var qs = {per_page:2, page:'two'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('returns 400 for page decimal value', function(done) {
        var qs = {per_page:2, page:2.2};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('returns totals when include_totals is true', function(done) {
        var qs = {include_totals:true, per_page:1};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(JSON.parse(body)).to.have.property('start');
          expect(JSON.parse(body)).to.have.property('limit');
          expect(JSON.parse(body)).to.have.property('length');
          done();
        });
      });

      it.skip('doesnt return totals when include_totals is false', function(done) {
        var qs = {include_totals:false, per_page:1};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('returns 400 when include_totals has integer value', function(done) {
        var qs = {include_totals:2, per_page:1};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('returns 400 when include_totals has string value', function(done) {
        var qs = {include_totals:"two", per_page:1};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('returns 200 for valid sort field names', function(done) {
        var qs = {sort:'email:1'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });

      it.skip('returns 400 for invalid sort field names', function(done) {
        var qs = {sort:'"email":1'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('sorts ascending for field:1', function(done) {
        var qs = {sort:'email:1'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          const first = JSON.parse(body)[0].email
          const last = JSON.parse(body).pop().email
          expect(first < last).to.be.true;
          done();
        });
      });

      it.skip('sorts descending for field:-1', function(done) {
        var qs = {sort:'email:-1'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          const first = JSON.parse(body)[0].email
          const last = JSON.parse(body).pop().email
          expect(first > last).to.be.true;
          done();
        });
      });

      it.skip('returns 400 for invalid sort order', function(done) {
        var qs = {sort:'email:2'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('returns 200 for valid field values passed to fields', function(done) {
        var qs = {fields:'email', include_fields:true};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });

      it.skip('returns 400 for invalid field values passed to fields', function(done) {
        var qs = {fields:'%$!', include_fields:true};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('returns requested field when include_fields: true', function(done) {
        var qs = {fields:'email', include_fields:true};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(JSON.parse(body)[0].email).to.exist;
          expect(JSON.parse(body)[0].username).not.to.exist;
          done();
        });
      });

      it.skip('doesnt return requested field when include_fields: false', function(done) {
        var qs = {fields:'email', include_fields:false};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(JSON.parse(body)[0].email).not.to.exist;
          expect(JSON.parse(body)[0].username).to.exist;
          done();
        });
      });
    });

    describe('custom query tests', function() {

      it.skip('search by email succeeds', function(done) {
        var qs = {q: 'email:user*', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body)[0].email).to.include('user');
          done();
        });
      });

      it.skip('search by id succeeds', function(done) {
        var qs = {q: 'user_id:*5d7c*', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body)[0].user_id).to.include('5d7c');
          done();
        });
      });

      it.skip('search by existing user email returns the user', function(done) {
        var qs = {q: 'email:user2@test.com', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body)[0].email).to.include('user2@test.com');
          done();
        });
      });

      it.skip('search by non-existing user email returns empty array', function(done) {
        var qs = {q: 'email:notauser*', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.eq(0);
          done();
        });
      });

      it.skip('search by partial email prefix returns the user', function(done) {
        var qs = {q: 'email:user*', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body)[0].email).to.include('user');
          done();
        });
      });

      it.skip('search by partial email suffix returns the user', function(done) {
        var qs = {q: 'email:*test.com', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body)[0].email).to.include('test.com');
          done();
        });
      });

      it.skip('search by partial email returns multiple existing matches', function(done) {
        var qs = {q: 'email:*test.com', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.be.gt(1);
          done();
        });
      });

      it.skip('search by phone_number succeeds', function(done) {
        // factory doesn't play with phone formats
      });

      it.skip('search by phone_verified succeeds', function(done) {
        // factory doesn't play with phone formats
      });

      it.skip('search by logins_count succeeds', function(done) {
        var qs = {q: 'logins_count:1', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.eq(1);
          done();
        });
      });

      it.skip('search by created_at succeeds', function(done) {
        var qs = {q: 'created_at:[2019-09-13T15:44:36.676Z TO 2019-09-14T15:44:36.676Z]', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.be.gt(1);
          done();
        });
      });

      it.skip('search by updated_at succeeds', function(done) {
        var qs = {q: 'updated_at:[2019-09-13T15:44:36.676Z TO 2019-09-14T15:44:36.676Z]', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.be.gt(1);
          done();
        });
      });

      it.skip('search by last_login succeeds', function(done) {
        var qs = {q: 'last_login:[2019-09-13T15:44:36.676Z TO 2019-09-14T15:44:36.676Z]', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.eq(1);
          done();
        });
      });

      it.skip('search by last_ip succeeds', function(done) {
        // skipping for now, just more of the same type of test
      });

      it.skip('search by blocked succeeds', function(done) {
        // skipping for now, just more of the same type of test
      });

      it.skip('search by email_domain succeeds', function(done) {
        // skipping for now, just more of the same type of test
      });

      it.skip('search by boolean metadata succeeds', function(done) {
        // skipping for now, just more of the same type of test
      });

      it.skip('search by integer metadata succeeds', function(done) {
        // skipping for now, just more of the same type of test
      });

      it.skip('search by text metadata succeeds', function(done) {
        // skipping for now, just more of the same type of test
      });

      it.skip('search by object nested text metadata succeeds', function(done) {
        // skipping for now, just more of the same type of test
      });

      it.skip('search by array nested text metadata succeeds', function(done) {
        // skipping for now, just more of the same type of test
      });
    });

    describe('exact and wildcard searches', function() {

      it.skip('search by exact name succeeds and returns matching result', function(done) {
        var qs = {q: 'name:Myrtis Yost', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.eq(1);
          expect(JSON.parse(body)[0].name).to.eq('Myrtis Yost');
          done();
        });
      });

      it.skip('search by exact name succeeds and returns no matching result', function(done) {
        var qs = {q: 'name:Joshua Cove', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.eq(0);
          done();
        });
      });

      it.skip('search by first initial and wildcard succeeds and returns matching results', function(done) {
        var qs = {q: 'name:M*', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.gt(1);
          done();
        });
      });

      it.skip('search by first initial and wildcard succeeds and returns no matching results', function(done) {
        var qs = {q: 'name:X*', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.eq(0);
          done();
        });
      });

      it.skip('search by wildcard and last letter returns a 400 error', function(done) {
        var qs = {q: 'name:*M', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('search by wildcard and last two letters returns a 400 error', function(done) {
        var qs = {q: 'name:*st', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      it.skip('search by wildcard and last three letters returns a 400 error', function(done) {
        var qs = {q: 'name:*ost', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.eq(1);
          expect(JSON.parse(body)[0].name).to.eq('Myrtis Yost');
          done();
        });
      });

      it.skip('search by wildcard and last three letters returns a 400 error', function(done) {
        var qs = {q: 'name:*xyz', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.eq(0);
          done();
        });
      });
    });

    describe('range searches', function() {

      it.skip('range searches on text fields return 400 error', function(done) {
        var qs = {q: 'name:[A TO Z]', search_engine: 'v3'};
        const options = Object.assign(opts, {qs: qs});
        request(options, function (error, response, body) {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

        it.skip('range searches on boolean fields return 400 error', function(done) {
          var qs = {q: 'blocked:[true TO false]', search_engine: 'v3'};
          const options = Object.assign(opts, {qs: qs});
          request(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
          });
        });

        it.skip('range searches on metadata fields return 400 error', function(done) {
          var qs = {q: 'myMetaField:[2019-09-13T15:44:36.676Z TO 2019-09-14T15:44:36.676Z]', search_engine: 'v3'};
          const options = Object.assign(opts, {qs: qs});
          request(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
          });
        });

        it.skip('range searches on date fields succeed', function(done) {
          var qs = {q: 'created_at:[2019-09-13T15:44:36.676Z TO 2019-09-14T15:44:36.676Z]', search_engine: 'v3'};
          const options = Object.assign(opts, {qs: qs});
          request(options, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
          });
        });

        it.skip('range searches include [ opening boundary', function(done) {
          var qs = {q: 'created_at:[2019-09-14T15:32:12.836Z TO 2019-09-14T15:40:04.681Z]', sort:'created_at:1', search_engine: 'v3'};
          const options = Object.assign(opts, {qs: qs});
          request(options, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(body)[0].email).to.eq('macey.boyle@test.com');
            done();
          });
        });

        it.skip('range searches exclude { opening boundary', function(done) {
          var qs = {q: 'created_at:{2019-09-14T15:32:12.836Z TO 2019-09-14T15:40:04.681Z]', sort:'created_at:1', search_engine: 'v3'};
          const options = Object.assign(opts, {qs: qs});
          request(options, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(body)[0].email).to.eq('sally.baumbach@test.com');
            done();
          });
        });

        it.skip('range searches include ] closing boundary', function(done) {
          var qs = {q: 'created_at:[2019-09-14T15:32:12.836Z TO 2019-09-14T15:40:04.681Z]', sort:'created_at:1', search_engine: 'v3'};
          const options = Object.assign(opts, {qs: qs});
          request(options, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(body).pop().email).to.eq('myrtis.yost@test.com');
            done();
          });
        });

        it.skip('range searches exclude } closing boundary', function(done) {
          var qs = {q: 'created_at:[2019-09-14T15:32:12.836Z TO 2019-09-14T15:40:04.681Z}', sort:'created_at:1', search_engine: 'v3'};
          const options = Object.assign(opts, {qs: qs});
          request(options, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(body).pop().email).to.eq('norma.bashirian@test.com');
            done();
          });
        });
      });
    });

    describe('search by email endpoint', function() {

      before(function() {
          opts = {
          uri: 'https://joshuacove.auth0.com/api/v2/users-by-email',
          qs: '',
          headers: headers
        };
      });

      describe('searches', function() {

        it.skip('search succeeds and returns a 200 for valid email', function(done) {
          var qs = {email: first};
          const options = Object.assign(opts, {qs: qs});
          request(options, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(body)[0].email).to.eq(first);
            done();
          });
        });

        it.skip('search succeeds and returns a 200 with empty array for valid email with different case', function(done) {
          var qs = {email: first.toUpperCase()};
          const options = Object.assign(opts, {qs: qs});
          request(options, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(body).length).to.eq(0);
            done();
          });
        });

        it.skip('search succeeds and returns a 400 for invalid email', function(done) {
          var qs = {email: 'whatever'};
          const options = Object.assign(opts, {qs: qs});
          request(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
          });
        });

        it.skip('search succeeds and returns a 200 with empty array for not found email', function(done) {
          var qs = {email: 'a@b.com'};
          const options = Object.assign(opts, {qs: qs});
          request(options, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(body).length).to.eq(0);
            done();
          });
        });
      });

      describe('query params', function() {

        it.skip('returns 400 for invalid field values passed to fields', function(done) {
          var qs = {email: first, fields: 'not_a_field'};
          const options = Object.assign(opts, {qs: qs});
          request(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
          });
        });

        it.skip('returns requested fields when include_fields is true', function(done) {
          var qs = {email: first, fields: 'email', include_fields:true};
          const options = Object.assign(opts, {qs: qs});
          request(options, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(body)[0].email).to.exist;
            expect(JSON.parse(body)[0].username).not.to.exist;
            done();
          });
        });

        it.skip('returns non-requested fields when include_fields is false', function(done) {
          var qs = {email: first, fields: 'email', include_fields:false};
          const options = Object.assign(opts, {qs: qs});
          request(options, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(body)[0].email).not.to.exist;
            expect(JSON.parse(body)[0].username).to.exist;
            done();
          });
        });

        it.skip('returns 400 when include_fields is not valid', function(done) {
          var qs = {email: first, fields: 'email', include_fields:'two'};
          const options = Object.assign(opts, {qs: qs});
          request(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
          });
        });
      });
    });
  });
