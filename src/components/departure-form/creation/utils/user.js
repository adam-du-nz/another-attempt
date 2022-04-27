import { filter } from "ramda";

const formatUser = user => ({
  label: [user.firstName, user.surname].join(" "),
  value: user.userPrincipalName
});

export const getDepartUserOptions = users => users.map(formatUser);

const isADEnabled = user => user.isADAccountEnabled;
const filterADEnabledUser = users => filter(isADEnabled, users);

export const getOnsiteRepresentativesOptions = users =>
  filterADEnabledUser(users);

export const getReplacementManagerOptions = (users, selectedUser) =>
  filterADEnabledUser(users)
    .filter(user => user.userPrincipalName !== selectedUser.userPrincipalName)
    .map(formatUser);
