export class AuthenticationContext {
  constructor() {
    console.log("Mock AuthenticationContext: constructor was called");
  }

  getCachedUser() {
    console.log("Mock AuthenticationContext: getCachedUser was called");
    return { userName: "lin.chen@myob.com" };
  }
}
