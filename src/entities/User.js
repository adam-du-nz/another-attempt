import { toUpper } from "ramda";

export default class User {
  createdAt;
  department;
  email;
  firstName;
  fullNameUppercase;
  function;
  group;
  id;
  isADAccountEnabled;
  isOnCall;
  lastBatchId;
  locationCountry;
  locationOffice;
  novatedProjectCode;
  payglobalUserId;
  payglobalUsername;
  phoneNumber;
  plannedTerminationDate;
  positionTitle;
  reportingManagerPayglobalUsername;
  startDate;
  surname;
  team;
  teamMemberLevel;
  updatedAt;
  userPrincipalName;
  vertical;
  visaCode;
  visaEffectEndDate;
  visaEffectStartDate;

  hasFullAccess() {
    const EMPLOYEE_SERVICE_DEPARTMENTS = [
      "PEOPLE CONSULTING",
      "EMPLOYEE LIFECYCLE & AUTOMATIO"
    ];
    return EMPLOYEE_SERVICE_DEPARTMENTS.includes(toUpper(this.department));
  }
}
