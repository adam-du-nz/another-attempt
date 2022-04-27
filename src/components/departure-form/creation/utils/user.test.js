import {
  getDepartUserOptions,
  getOnsiteRepresentativesOptions,
  getReplacementManagerOptions
} from "./user";

describe("userUtils", () => {
  it("should generate options correctly", () => {
    const users = [
      {
        userPrincipalName: "a@a.com",
        firstName: "a",
        surname: "a",
        isADAccountEnabled: true
      },
      {
        userPrincipalName: "b@b.com",
        firstName: "b",
        surname: "b",
        isADAccountEnabled: true
      },
      {
        userPrincipalName: "c@c.com",
        firstName: "c",
        surname: "c",
        isADAccountEnabled: false
      }
    ];

    expect(getDepartUserOptions(users)).toMatchObject([
      { label: "a a", value: "a@a.com" },
      { label: "b b", value: "b@b.com" },
      { label: "c c", value: "c@c.com" }
    ]);
    expect(getOnsiteRepresentativesOptions(users)).toMatchObject([
      {
        userPrincipalName: "a@a.com",
        firstName: "a",
        surname: "a",
        isADAccountEnabled: true
      },
      {
        userPrincipalName: "b@b.com",
        firstName: "b",
        surname: "b",
        isADAccountEnabled: true
      }
    ]);
    expect(
      getReplacementManagerOptions(users, { userPrincipalName: "b@b.com" })
    ).toMatchObject([{ label: "a a", value: "a@a.com" }]);
  });
});
