# auth0-exercise

## The task:
Starting from scratch, we would like you to automate a set of API tests using a framework of your choice, to validate that this User Search API is functioning as intended.
User Search API documentation may be found here: https://auth0.com/docs/users/search/v3.
(Note that there are different versions of the API.)
Also we would like to see your ability to handle data setup and teardown. You may consider using a public SDK to interact with Auth0 APIs. Supported Auth0 SDKs are listed here: https://auth0.com/docs/libraries#auth0-sdks

### Deliverables
A repository on GitHub or Bitbucket containing code and documentation relating to this exercise
Code which executes the test cases, producing clear output indicating which tests passed/failed
Documentation which describes how to setup and run these tests
Documentation which describes the approach to writing additional tests
Documentation explaining any limitations, outstanding TODOs, known issues, or problematic test cases

## Response

### Setup and run these tests:
1. Checkout the repo
2. In a terminal, `cd` into the `auth0-exercise` folder
3. Run tests with `npm test`

### Writing additional tests:
In writing these tests I chose to focus on the searches using `/api/v2/users` and `/api/v2/users-by-email` using V3 syntax. 
The following would need to be included in a full coverage test suite as well:
1. V2 syntax and search engine
2. Searching within app and user metadata
3. Searches limited to a given connection or IdP
4. Searches using more advanced query syntax, such as proximity matches, boosts, etc
5. Determine which security, load and performance testing are safe to perform in Prod

Any additional tests should also be tagged so as to run them selectively and at the right times. Suggested tags would be:
1. Priority:
  a. P1 - always run. Core business logic
  b. P2 - run for full regression, for example error handling for inappropriate API usage, things you wouldn't be able to do if using the SDKs
2. Topic: For example by endpoint, by http verb, by business logic / swagger definition, etc.
3. If metrics are desired, then also tags like positive/negative, flaky, deprecated-functionality, etc.

### Test limitations:
Free Prod tenants are rate limited at 2 API requests per second, which is significantly slower than a typical test suite. To work around this, each test is followed by a 500ms sleep and the concurrency test was moved to the end of the file.

### Outstanding TODOs:
There were a couple tests i'd planned to do, but found too complicated to set up scenarios for in this amount of time:
1. Return a 401 error for requests with `client not global`
2. Return a 403 error for requests with insufficient scope
3. Return a 504 error for timed out requests
4. Enabling an SMS connection to create users with `phone_number` and `phone_verified` and test searches on those fields
5. Left place holders for some skipped tests that would enhance coverage but not add much value for a code exercise, just more of the same tests on other fields

### Code quality:
1. Best practice would be to create a new tenant, new users, new DB connection and other resources on each test run. Instead I've reused the same one. The main reason was to save time investigating additional endpoints, so as to focus more on the main aspect of the code exercise. This is the first thing i'd fix if converting these to a real test suite.
2. Extract the create users method (and any others) to separate files so as to keep the test file clean. Since it is the only method in this case, seemed the exercise would be cleaner with fewer files. In the context of an automation suite, the method should live elsewhere.
3. Putting the auth token in a config file. Ideally, the token should be retrieved by API when creating the new tenant. Since I reused the same tenant, it made sense to just keep the token as well. Sensitive info should be constrained to config files though and not lie around in test files.

### Known issues:
Unfortunately, I didn't find any bugs in these endpoints. That's disturbing.

### Problematic tests:
Not yet being an expert in async flows, I had difficulty setting parameters from one API call to use in assertions for another call in the same test. The proper solution probably involves a `.then` to pass context from one section to the next. Instead, I made a workaround, getting those values in a sudo test that doesn't have assertions, in order to use them in the next test. 
Not something i'd be willing to leave in for a real test suite.
