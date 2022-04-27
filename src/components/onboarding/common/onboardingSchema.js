/* eslint-disable no-template-curly-in-string */
import { all, isNil } from "ramda";
import * as yup from "yup";

export const onboardingSchema = yup.object().shape({
  /** Employee Details **/
  legalFirstName: yup
    .string()
    .required("Mandatory")
    .max(128, "Legal first name has a max length of 128 characters"),
  preferredFirstName: yup
    .string()
    .max(128, "Preferred first name has a max length of 128 characters"),
  surname: yup
    .string()
    .required("Mandatory")
    .max(128, "Surname has a max length of 128 characters"),
  email: yup.string().email().required("Mandatory"),
  phoneNumber: yup
    .string()
    .required("Mandatory")
    .max(128, "Phone number has a max length of 128 characters"),
  firstDayContact: yup.object().required("Mandatory"),
  tShirtSize: yup.string().required("Mandatory"),
  workingRightsOptions: yup.string().required("Mandatory"),
  employmentTypeOptions: yup.string().required("Mandatory"),
  fixedTermReason: yup.string().when("employmentTypeOptions", {
    is: "Fixed Term",
    then: yup.string().required("Please specify a reason")
  }),
  startDate: yup
    .string()
    .matches(
      /\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/, // regex to match yyyy-mm-dd
      "Please pick a valid date"
    )
    .required("Mandatory"),
  startTime: yup.string().required("Mandatory"),
  endDate: yup.string().when("employmentTypeOptions", {
    is: "Fixed Term",
    then: yup
      .string()
      .matches(
        /\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/, // regex to match yyyy-mm-dd
        "Please pick a valid date"
      )
      .required("Mandatory")
      .test({
        name: "isEndDateAfterStartDate",
        exclusive: true,
        message: "End date must be after start date",
        test: function (endDate) {
          return Date.parse(this.parent.startDate) < Date.parse(endDate);
        }
      })
  }),
  /** Position Details **/
  teamMemberLevel: yup.string().required("Please specify a team member level"),
  positionTitle: yup.string().required("Please specify position title"),
  positionDescriptionAttachment: yup.array().when("employmentTypeOptions", {
    is: "Casual",
    then: yup.array(), // don't require this attachment for casual
    otherwise: yup
      .array()
      .ensure([])
      .required("Mandatory")
      .test("all success", "Some files didn't upload successfully", array =>
        all(v => !isNil(v.uploadedName), array)
      )
  }),
  casualProjectDescription: yup.string().when("employmentTypeOptions", {
    is: "Casual",
    then: yup.string().required("Please specify a project description")
  }),
  directManager: yup.object().required("Please specify a direct manager"),
  function: yup.object().required("Please specify a function"),
  group: yup.object().nullable().required("Please specify a group"),
  vertical: yup.object().required("Please specify a vertical"),
  costCentre: yup.object().required("Please specify a cost centre"),
  codeRequired: yup.array().ensure(),
  projectType: yup.string().when(["codeRequired"], {
    is: codeRequired =>
      codeRequired && Array.from(codeRequired).includes("requiresCostCode"),
    then: yup.string().required("Please specify project type"),
    otherwise: yup.string()
  }),
  projectCostCentre: yup.object().when(["codeRequired"], {
    is: codeRequired =>
      codeRequired && Array.from(codeRequired).includes("requiresCostCode"),
    then: yup.object().required("Please specify project cost centre"),
    otherwise: yup.object()
  }),
  /** Agreement Details **/
  primaryOffice: yup.string().required("Mandatory"),
  relocationExpenses: yup.array().ensure(),
  remoteWork: yup.array().ensure(),
  workingHoursOptions: yup.string().when(["employmentTypeOptions"], {
    is: employmentTypeOptions => employmentTypeOptions !== "Casual",
    then: yup.string().required("Please chooses a working-hours option"),
    otherwise: yup.string()
  }),
  numberOfHoursPerWeek: yup
    .number()
    .when(["workingHoursOptions", "employmentTypeOptions"], {
      is: (workingHoursOptions, employmentTypeOptions) =>
        workingHoursOptions === "Part Time Hours" &&
        employmentTypeOptions !== "Casual",
      then: yup
        .number()
        .nullable(true)
        .transform((v, o) => (o === "" ? null : v))
        .min(5, "Please enter the correct number of hours")
        .max(40, "Please enter the correct number of hours")
        .required("Please enter the correct number of hours")
    }),
  usualDays: yup
    .string()
    .when(["workingHoursOptions", "employmentTypeOptions"], {
      is: (workingHoursOptions, employmentTypeOptions) =>
        workingHoursOptions === "Part Time Hours" &&
        employmentTypeOptions !== "Casual",
      then: yup.string().required("Mandatory")
    }),
  baseSalary: yup.number().when("employmentTypeOptions", {
    is: "Casual",
    then: yup.number(),
    otherwise: yup
      .number()
      .nullable(true)
      .transform((v, o) => (o === "" ? null : v))
      .min(10000, "Please enter the correct base salary amount")
      .required("Please enter the correct base salary amount")
  }),
  casualHourlyRate: yup.number().when("employmentTypeOptions", {
    is: "Casual",
    then: yup
      .number()
      .nullable(true)
      .transform((v, o) => (o === "" ? null : v))
      .min(1, "Please enter the correct hourly rate")
      .required("Please enter the correct hourly rate")
  }),
  commission: yup.array().ensure(),
  onTargetEarnings: yup.number().when("commission", {
    is: "commissionRequired",
    then: yup
      .number()
      .nullable(true)
      .transform((v, o) => (o === "" ? null : v))
      .min(1, "OTE cannot be less than ${min}")
      .required("Mandatory")
  }),
  commissionPaymentFrequency: yup.string().when("commission", {
    is: "commissionRequired",
    then: yup.string().required("Mandatory")
  }),
  commentsOnAgreement: yup.string(),
  /** Finance Details **/
  creditCard: yup.array().ensure(),
  creditLimit: yup
    .number()
    .nullable(true)
    .transform((v, o) => (o === "" ? null : v))
    .when(["primaryOffice", "creditCard"], {
      is: (primaryOffice, creditCard) =>
        String(primaryOffice).startsWith("AU") &&
        String(creditCard) === "creditCardIsRequired",
      then: yup
        .number()
        .min(1, "Credit limit cannot be less than ${min}")
        .max(5000, "Maximum limit is ${max}")
        .required("Please enter a number")
    })
    .when(["primaryOffice", "creditCard"], {
      is: (primaryOffice, creditCard) =>
        !String(primaryOffice).startsWith("AU") &&
        String(creditCard) === "creditCardIsRequired",
      then: yup
        .number()
        .min(1, "Credit limit cannot be less than ${min}")
        .max(3000, "Maximum limit is  ${max}")
        .required("Please enter a number")
    }),
  delegatedApprovalAuthority: yup.array().ensure(),
  approvalLimit: yup
    .number()
    .nullable(true)
    .transform((v, o) => (o === "" ? null : v))
    .when(["teamMemberLevel", "delegatedApprovalAuthority"], {
      is: (teamMemberLevel, delegatedApprovalAuthority) =>
        String(teamMemberLevel) === "ELT" &&
        String(delegatedApprovalAuthority) === "hasDelegatedApprovalAuthority",
      then: yup
        .number()
        .min(1, "Approval limit cannot be less than ${min}")
        .max(500000, "ELT level has a capped approval limit of ${max}")
        .required("Please enter a number")
    })
    .when(["teamMemberLevel", "delegatedApprovalAuthority"], {
      is: (teamMemberLevel, delegatedApprovalAuthority) =>
        String(teamMemberLevel) === "SLT" &&
        String(delegatedApprovalAuthority) === "hasDelegatedApprovalAuthority",
      then: yup
        .number()
        .min(1, "Approval limit cannot be less than ${min}")
        .max(150000, "SLT level has a capped approval limit of ${max}")
        .required("Please enter a number")
    }),

  financeAttachments: yup
    .array()
    .when(["creditCard", "delegatedApprovalAuthority"], {
      is: (creditCard, delegatedApprovalAuthority) =>
        String(creditCard) === "creditCardIsRequired" ||
        String(delegatedApprovalAuthority) === "hasDelegatedApprovalAuthority",
      then: yup
        .array()
        .ensure([])
        .required("Mandatory")
        .test("all success", "Some files didn't upload successfully", array =>
          all(v => !isNil(v.uploadedName), array)
        )
    }),
  /** IT Details **/
  localAdmin: yup.array().nullable(true),
  computerHardware: yup.string().required("Please select a model"),
  isGenesysRequired: yup.array().nullable(true),
  genesysAgentGroup: yup
    .string()
    .nullable(true)
    .when(["isGenesysRequired"], {
      is: isGenesysRequired =>
        String(isGenesysRequired) === "isGenesysRequired",
      then: yup.string().required("Please choose a Genesys agent group")
    }),
  isMobilePhoneRequired: yup.array().nullable(true),
  isPortACurrentNumberRequired: yup
    .array()
    .nullable(true)
    .when(["isMobilePhoneRequired"], {
      is: isMobilePhoneRequired =>
        String(isMobilePhoneRequired) === "isMobilePhoneRequired",
      then: yup.array().nullable(true)
    }),
  currentPhoneNumber: yup
    .number()
    .nullable(true)
    .transform((v, o) => (o === "" ? null : v))
    .min(1, "Please provide a valid phone number")
    .when(["isPortACurrentNumberRequired"], {
      is: isPortACurrentNumberRequired =>
        String(isPortACurrentNumberRequired) === "isPortACurrentNumberRequired",
      then: yup.number().required("Please input the current number")
    }),
  currentServiceProvider: yup.string().when(["isPortACurrentNumberRequired"], {
    is: isPortACurrentNumberRequired =>
      String(isPortACurrentNumberRequired) === "isPortACurrentNumberRequired",
    then: yup.string().required("Please input the current service provider")
  }),
  networkDrives: yup.string(),
  teamsDirectNumber: yup.array().nullable(true),
  archieAccessBasedOn: yup.object().when(["software"], {
    is: software => software && Array.from(software).includes("archie"),
    then: yup.object().required("Mandatory")
  }),
  reportingLineManager: yup.object().when(["software"], {
    is: software => software && Array.from(software).includes("archie"),
    then: yup.object().required("Mandatory")
  }),
  countryAccess: yup
    .array()
    .nullable(true)
    .when(["software"], {
      is: software => software && Array.from(software).includes("archie"),
      then: yup.array().nullable(true)
    }),
  thisEmployeeIsAManagerInArchie: yup
    .array()
    .nullable(true)
    .when(["software"], {
      is: software => software && Array.from(software).includes("archie"),
      then: yup.array().nullable(true)
    }),
  archieTextBox: yup.string().when(["software"], {
    is: software => software && Array.from(software).includes("archie"),
    then: yup.string()
  }),
  archieAnalyticsAccessBasedOn: yup.object().when(["software"], {
    is: software =>
      software && Array.from(software).includes("archieAnalytics"),
    then: yup.object().required("Mandatory")
  }),
  banklinkAccessBasedOn: yup.object().when(["software"], {
    is: software => software && Array.from(software).includes("banklink"),
    then: yup.object().required("Mandatory")
  }),
  banklinkAccessRequired: yup
    .array()
    .nullable(true)
    .when(["software"], {
      is: software => software && Array.from(software).includes("banklink"),
      then: yup.array().nullable(true)
    }),
  zendeskInstance: yup
    .array()
    .nullable(false)
    .when(["software"], {
      is: software => software && Array.from(software).includes("zendesk"),
      then: yup
        .array()
        .nullable(false)
        .required("Please select a Zendesk instance")
    }),
  zendeskQueue: yup.string().when(["software"], {
    is: software => software && Array.from(software).includes("zendesk"),
    then: yup
      .string()
      .required(
        "Please provide a valid zendesk queue name otherwise type in N/A"
      )
  }),
  otherSoftware: yup.string().when(["software"], {
    is: software => software && Array.from(software).includes("other"),
    then: yup.string().required("Please specify the software")
  }),
  sharedMailbox: yup.string(),
  additionalItAccess: yup.string(),
  salesforceProvision: yup.array().ensure(),
  cancelReason: yup.string()
});
