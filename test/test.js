const apiTest  = require('./setup');
var request = require("request");
var chai = require("chai");
var expect = chai.expect;

const token = "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9UUXdNakpCUmtVMFJFSTNNekEzTkVGQ016TXlNRUV5UmpZMU5USXdRVVV6TVRReU5UUkNNdyJ9.eyJpc3MiOiJodHRwczovL2pvc2h1YWNvdmUuYXV0aDAuY29tLyIsInN1YiI6InZzWGlmSTV1NzNZcGM5UTJlcjQ2bzUxREdDTmhzRktNQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2pvc2h1YWNvdmUuYXV0aDAuY29tL2FwaS92Mi8iLCJpYXQiOjE1NjgzMzM2ODgsImV4cCI6MTU2ODQyMDA4OCwiYXpwIjoidnNYaWZJNXU3M1lwYzlRMmVyNDZvNTFER0NOaHNGS00iLCJzY29wZSI6InJlYWQ6Y2xpZW50X2dyYW50cyBjcmVhdGU6Y2xpZW50X2dyYW50cyBkZWxldGU6Y2xpZW50X2dyYW50cyB1cGRhdGU6Y2xpZW50X2dyYW50cyByZWFkOnVzZXJzIHVwZGF0ZTp1c2VycyBkZWxldGU6dXNlcnMgY3JlYXRlOnVzZXJzIHJlYWQ6dXNlcnNfYXBwX21ldGFkYXRhIHVwZGF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgZGVsZXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOnJ1bGVzX2NvbmZpZ3MgdXBkYXRlOnJ1bGVzX2NvbmZpZ3MgZGVsZXRlOnJ1bGVzX2NvbmZpZ3MgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDp0ZW5hbnRfc2V0dGluZ3MgdXBkYXRlOnRlbmFudF9zZXR0aW5ncyByZWFkOmxvZ3MgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.P9byU262qf0_U66UyAYGsBui-sxrSrVDonNmma7qH3ftDSuRhvFjP_bRcuDNgMmOZQ5ywfDqq0ngHjosNEFMtgUAYiIPSd_P9i68FA6VaAKuyRPZr579qdEBGNtrYYdbP2x5_9kvAm8CZvOSs1GofW_-rqkDG7PKpOqqfsEIHOSj4UFdS5dqB8NsvnGWEP09jZLS9e4Qsyyk-Hxvfa5YCMqXuDnJeNmjPmXafSrDA1jmJICOdjqb1lhgquvj6co_Ej89BlODFk3pt4ceBXKZ-GiRSMD5NpLv1Nzx4_edE_FuU_NIUNf_pd7IeIy6vHvC2zkU97kl-E5d5kOuDHAlJQ";
const headers = `{authorization: ${token}}`;

var options = {
  method: 'GET',
  uri: 'https://joshuacove.auth0.com/api/v2/users',
  qs: {q: 'email:"user*"', search_engine: 'v3'},
  headers: headers
};

describe('search users tests', function() {
  describe('auth tests', function() {
    it('should return 401 for requests without authorization header', function() {
      var opts = Object.assign(options, {headers:''});
      request(opts, function (error, response, body) {
        if (error) throw new Error(error);
        expect(response.statusCode).to.equal(401);
      });
    });

    it('should return 401 for requests without authorization token', function() {
      var opts = Object.assign(options, {headers: {authorization: ''}});
      request(opts, function (error, response, body) {
        if (error) throw new Error(error);
        expect(response.statusCode).to.equal(401);
      });
    });

    it('should return 401 for requests with invalid authorization token', function() {
      const invalid_token = `{authorization: ${token.slice(20, token.length)}}`
      var opts = Object.assign(options, {headers: invalid_token});
      request(opts, function (error, response, body) {
        if (error) throw new Error(error);
        expect(response.statusCode).to.equal(401);
      });
    });

    it('should return 401 for requests with not found authorization token', function() {
      const not_found_token = `{authorization: ${token.slice(0, -1)+'a'}}`
      var opts = Object.assign(options, {headers: not_found_token});
      request(opts, function (error, response, body) {
        if (error) throw new Error(error);
        expect(response.statusCode).to.equal(401);
      });
    });

    it('should return 401 for requests with invalid signature token', function() {
      const invalid_signature_token = `{authorization: ${token.slice(0, -1)}}`
      var opts = Object.assign(options, {headers: invalid_signature_token});
      request(opts, function (error, response, body) {
        if (error) throw new Error(error);
        expect(response.statusCode).to.equal(401);
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
});
