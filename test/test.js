var faker = require('faker');
var request = require("request");
// require('request').debug = true
var chai = require("chai");
var expect = chai.expect;
var should = chai.should;
var user_factory  = require('./user_factory');
var makeUser = user_factory.makeUser;

let first;
let second;
let third;

const token = "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9UUXdNakpCUmtVMFJFSTNNekEzTkVGQ016TXlNRUV5UmpZMU5USXdRVVV6TVRReU5UUkNNdyJ9.eyJpc3MiOiJodHRwczovL2pvc2h1YWNvdmUuYXV0aDAuY29tLyIsInN1YiI6InZzWGlmSTV1NzNZcGM5UTJlcjQ2bzUxREdDTmhzRktNQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2pvc2h1YWNvdmUuYXV0aDAuY29tL2FwaS92Mi8iLCJpYXQiOjE1Njg0MjAzMDMsImV4cCI6MTU3MTAxMjMwMywiYXpwIjoidnNYaWZJNXU3M1lwYzlRMmVyNDZvNTFER0NOaHNGS00iLCJzY29wZSI6InJlYWQ6Y2xpZW50X2dyYW50cyBjcmVhdGU6Y2xpZW50X2dyYW50cyBkZWxldGU6Y2xpZW50X2dyYW50cyB1cGRhdGU6Y2xpZW50X2dyYW50cyByZWFkOnVzZXJzIHVwZGF0ZTp1c2VycyBkZWxldGU6dXNlcnMgY3JlYXRlOnVzZXJzIHJlYWQ6dXNlcnNfYXBwX21ldGFkYXRhIHVwZGF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgZGVsZXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOnJ1bGVzX2NvbmZpZ3MgdXBkYXRlOnJ1bGVzX2NvbmZpZ3MgZGVsZXRlOnJ1bGVzX2NvbmZpZ3MgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDp0ZW5hbnRfc2V0dGluZ3MgdXBkYXRlOnRlbmFudF9zZXR0aW5ncyByZWFkOmxvZ3MgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.XoBao8rtz-zfJlR5jf956bzqZbAhEt5baI8dlwwD52lOgQ9f6kvZoyIst9ANZP1aaeqyrJbgTQ5AJiEC3mYjPha5KO_krihcc1SxYK1j3w4TpO1nxJy2WDD0VPtcRw69CRtSgHI1WRMq-MKpze2dz9lp6a9KKwPOv7dSlt2OSOzPJMGlpgf1c4HH0ELKeuP7jizq8SOzs739X6jlJWsI9SLI7Oc1qxbnzGB4OEKK8IXOMtVypWpqeU2Oo9F6eGHf0Ol3HcEUm8ksNBYbzCy9JkL4Tp0Uf8HHvjX2S0NB4UmXTwtKElx24JUkQTTXV8xcODY4RFxcwHTjU8kBomfKnQ";
const headers = {Authorization: `${token}`, Accept: 'application/json'};

const opts = {
  method: 'GET',
  uri: 'https://joshuacove.auth0.com/api/v2/users',
  qs: '',
  headers: headers,
  form: ''
};

function createUsers(n) {
  var body = makeUser();
  var options = Object.assign(opts, {method:'', form: body, uri: 'https://joshuacove.auth0.com/api/v2/users', headers: headers});
  console.log(options);
  var i = 0;
  for (i = 0; i < n; i++) {
    request.post(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
    });
  }
}

describe('search users tests', function() {

  describe('auth tests', function() {
    it.skip('should return 401 for requests without authorization header', function(done) {
      var options = Object.assign(opts, {headers:''});
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        expect(response.statusCode).to.equal(401);
        done();
      });
    });

    it.skip('should return 401 for requests without authorization token', function(done) {
      var options = Object.assign(opts, {headers: {authorization: ''}});
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        expect(response.statusCode).to.equal(401);
        done();
      });
    });

    it.skip('should return 401 for requests with invalid authorization token', function(done) {
      const invalid_token = `{authorization: ${token.slice(20, token.length)}}`
      var options = Object.assign(opts, {headers: invalid_token});
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        expect(response.statusCode).to.equal(401);
        done();
      });
    });

    it.skip('should return 401 for requests with not found authorization token', function(done) {
      const not_found_token = `{authorization: ${token.slice(0, -1)+'a'}}`
      var options = Object.assign(opts, {headers: not_found_token});
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        expect(response.statusCode).to.equal(401);
        done();
      });
    });

    it.skip('should return 401 for requests with invalid signature token', function(done) {
      const invalid_signature_token = `{authorization: ${token.slice(0, -1)}}`
      var options = Object.assign(opts, {headers: invalid_signature_token});
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

    it.skip('should return 429 for concurrent requests', function() {
      // npm install loadtest
      // loadtest -c 10 --rps 200 http://mysite.com/ -H...
    });

    it.skip('should return 503 for timed out requests', function() {

    });
  });

  describe('query parameter tests', function() {
    // before(function() {
    //   createUsers(2);
    // });

    it.skip('should return 400 for invalid query string', function(done) {
      var qs = {q: 'mail:"user*"', search_engine: 'v3'};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it.skip('should return 400 for "q" without "search_engine"', function(done) { // not sure where I read that, this does work
      var qs = {q: 'email:"user*"'};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it.skip('should return 400 for invalid search engine value', function(done) {
      var qs = {q: 'email:"user*"', search_engine: 'v4'};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it.skip('should return 400 for invalid v2 search syntax', function(done) {
      var qs = {q: 'email:"user*"', search_engine: 'v2'};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it.skip('should return 400 for invalid v3 search syntax', function(done) {
      var qs = {q: 'name.raw:"jane"', search_engine: 'v3'};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it.skip('returns the requested numnber of results for valid per_page value', function(done) {
      var qs = {per_page:2};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(JSON.parse(body).length).to.equal(2);
        done();
      });
    });

    it.skip('returns all results when there are less than the per_page value', function(done) {
      var qs = {per_page:50};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(JSON.parse(body).length).to.equal(19); // need to find a way to get the total count and calculate the last page
        done();
      });
    });

    it.skip('returns 400 for per_page > 100', function(done) {
      var qs = {per_page:101};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it.skip('returns 400 for per_page < 0', function(done) {
      var qs = {per_page:-1};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it.skip('returns 400 for per_page string value', function(done) {
      var qs = {per_page:'ten'};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it.skip('returns 400 for per_page decimal value', function(done) {
      var qs = {per_page:2.2};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it.skip('returns empty array for page without per_page', function(done) {
      var qs = {page:2};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(JSON.parse(body).length).to.equal(0);
        done();
      });
    });

    // not a test, but was quicker than finding a way to save the email values within one test
    it.skip('gets user emails', function(done) {
      var qs = {per_page:3, page:0};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        first = JSON.parse(body)[0].email;
        second = JSON.parse(body)[1].email;
        third = JSON.parse(body)[2].email;
        done();
      });
    });

    it.skip('returns requested page for valid page value', function(done) {
      var qs = {per_page:1, page:1};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(JSON.parse(body)[0].email).to.eq(second);
        expect(JSON.parse(body)[0].email).not.to.eq(first);
        expect(JSON.parse(body)[0].email).not.to.eq(third);
        done();
      });
    });

    it.skip('returns 400 for > 1000 results', function(done) {
      var qs = {per_page:100, page:20};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it.skip('returns 400 for page value < 0', function(done) {
      var qs = {per_page:2, page:-1};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it.skip('returns 400 for page string value', function(done) {
      var qs = {per_page:2, page:'two'};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it.skip('returns 400 for page decimal value', function(done) {
      var qs = {per_page:2, page:2.2};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it.skip('returns totals when include_totals is true', function(done) {
      var qs = {include_totals:true, per_page:1};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(JSON.parse(body)).to.have.property('start');
        expect(JSON.parse(body)).to.have.property('limit');
        expect(JSON.parse(body)).to.have.property('length');
        done();
      });
    });

    it.skip('doesnt return totals when include_totals is false', function(done) {
      var qs = {include_totals:false, per_page:1};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it.skip('returns 400 when include_totals has integer value', function(done) {
      var qs = {include_totals:2, per_page:1};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it.skip('returns 400 when include_totals has string value', function(done) {
      var qs = {include_totals:"two", per_page:1};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it.skip('returns 200 for valid sort field names', function(done) {
      var qs = {sort:'email:1'};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it.skip('returns 400 for invalid sort field names', function(done) {
      var qs = {sort:'"email":1'};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it.skip('sorts ascending for field:1', function(done) {
      var qs = {sort:'email:1'};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        const first = JSON.parse(body)[0].email
        const last = JSON.parse(body).pop().email
        expect(first < last).to.be.true;
        done();
      });
    });

    it.skip('sorts descending for field:-1', function(done) {
      var qs = {sort:'email:-1'};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        const first = JSON.parse(body)[0].email
        const last = JSON.parse(body).pop().email
        expect(first > last).to.be.true;
        done();
      });
    });

    it.skip('returns 400 for invalid sort order', function(done) {
      var qs = {sort:'email:2'};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it('returns 200 for valid field values passed to fields', function(done) {
      var qs = {fields:'email', include_fields:true};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it('returns 400 for invalid field values passed to fields', function(done) {
      var qs = {fields:'%$!', include_fields:true};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it('returns requested field when include_fields: true', function(done) {
      var qs = {fields:'email', include_fields:true};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(JSON.parse(body)[0].email).to.exist;
        done();
      });
    });

    it('doesnt return requested field when include_fields: false', function(done) {
      var qs = {fields:'email', include_fields:false};
      var options = Object.assign(opts, {qs: qs});
      request(options, function (error, response, body) {
        expect(JSON.parse(body)[0].email).not.to.exist;
        done();
      });
    });

  });
});
