import User from "../entities/User";

export default class UserFactory {
  static create(userJson) {
    const user = new User();

    for (const [key, value] of Object.entries(userJson)) {
      user[key] = value;
    }

    user.fullName = [user.firstName, user.surname].join(" ");

    return user;
  }

  static createFromArray(users) {
    return users.map(userJson => UserFactory.create(userJson));
  }
}
