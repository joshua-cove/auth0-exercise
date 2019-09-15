var faker = require('faker');

module.exports = {
  makeUser: function (values = {}) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    const initial = {
      email: firstName.concat('.', lastName, '@test.com'),
      // phone_number: faker.phone.phoneNumberFormat(0), // couldn't figure out what it means phone only allowed for users from SMS connections
      user_metadata: {},
      blocked: faker.random.boolean(),
      email_verified: faker.random.boolean(),
      // phone_verified: faker.random.boolean(),
      app_metadata: {},
      given_name: firstName,
      family_name: lastName,
      name: firstName.concat(' ', lastName),
      nickname: firstName,
      picture: 'https://s.gravatar.com/avatar/eb7c8c7791f4f4c7cdd712635277a1f2?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fus.png',
      user_id: faker.random.uuid(),
      connection: 'Username-Password-Authentication',
      password: faker.internet.password(),
      verify_email: faker.random.boolean(),
      username: faker.internet.userName()
    };

    const user = Object.assign(initial, values);
    return user;
  }
}
