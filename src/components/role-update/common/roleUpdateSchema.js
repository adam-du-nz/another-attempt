/* eslint-disable no-template-curly-in-string */
import { all, isNil } from "ramda";
import * as yup from "yup";

export const roleUpdateSchema = yup.object().shape({
  employee: yup.object().required("Select an employee"),

  /********** Change Type section *******************************/

  thirdPartyChangeType: yup
    .string()
    .ensure()
    .when("employee", {
      is: employee => {
        return employee.employmentType === "COA";
      },
      then: yup.string().required("Select a change type")
    }),
  casualChangeType: yup
    .string()
    .ensure()
    .when("employee", {
      is: employee => {
        return employee.employmentType === "CAS";
      },
      then: yup.string().required("Select a change type")
    }),
  parentalLeaveChangeType: yup
    .string()
    .ensure()
    .when("employee", {
      is: employee => {
        return employee.employmentType === "MAT";
      },
      then: yup.string().required("Select a change type")
    }),
  fixedTermChangeType: yup
    .string()
    .ensure()
    .when("employee", {
      is: employee => {
        return (
          employee.employmentType === "FT.FIXED" ||
          employee.employmentType === "PT.FIXED"
        );
      },
      then: yup.string().required("Select a change type")
    }),
  secondmentChangeType: yup
    .string()
    .ensure()
    .when("employee", {
      is: employee => {
        return (
          employee.employmentType === "SEC - FT" ||
          employee.employmentType === "SEC - PT"
        );
      },
      then: yup.string().required("Select a change type")
    }),
  permanentChangeType: yup
    .string()
    .ensure()
    .when("employee", {
      is: employee => {
        return (
          employee.employmentType === "FT" || employee.employmentType === "PT"
        );
      },
      then: yup.string().required("Select a change type")
    }),
  contractorNewEndDate: yup.string().when("thirdPartyChangeType", {
    is: "Contractor's end date extension",
    then: yup.string().required("End date required")
  }),
  contractorAcknowledged: yup
    .array()
    .ensure()
    .when("thirdPartyChangeType", {
      is: "Contractor's end date extension",
      then: yup.array().required("Acknowledgement required")
    }),
  changeApproved: yup
    .array()
    .ensure()
    .when("thirdPartyChangeType", {
      is: "Contractor's end date extension",
      then: yup.string().ensure(),
      otherwise: yup.array().required("Approval required")
    }),
  effectiveDate: yup
    .string()
    .ensure()
    .when(
      ["thirdPartyChangeType", "secondmentChangeType", "fixedTermChangeType"],
      {
        is: (
          thirdPartyChangeType,
          secondmentChangeType,
          fixedTermChangeType
        ) => {
          return (
            thirdPartyChangeType === "Contractor's end date extension" ||
            secondmentChangeType === "Secondment contract extension" ||
            fixedTermChangeType === "Fixed Term contract extension"
          );
        },
        then: yup.string().ensure(),
        otherwise: yup.string().required("Effective date required")
      }
    ),
  fixedTermEndDate: yup
    .string()
    .ensure()
    .when(
      [
        "thirdPartyChangeType",
        "casualChangeType",
        "fixedTermChangeType",
        "permanentChangeType"
      ],
      {
        is: (
          thirdPartyChangeType,
          casualChangeType,
          fixedTermChangeType,
          permanentChangeType
        ) => {
          return (
            thirdPartyChangeType ===
              "Change contractor to fixed term MYOB employee" ||
            casualChangeType === "Change casual to fixed term MYOB employee" ||
            fixedTermChangeType === "Fixed Term transfer to new position" ||
            permanentChangeType === "Permanent transfer to Fixed Term"
          );
        },
        then: yup.string().ensure().required("Fixed Term end date required")
      }
    ),
  reasonForFixedTerm: yup
    .string()
    .ensure()
    .when(["thirdPartyChangeType", "casualChangeType", "permanentChangeType"], {
      is: (thirdPartyChangeType, casualChangeType, permanentChangeType) => {
        return (
          thirdPartyChangeType ===
            "Change contractor to fixed term MYOB employee" ||
          casualChangeType === "Change casual to fixed term MYOB employee" ||
          permanentChangeType === "Permanent transfer to Fixed Term"
        );
      },
      then: yup.string().ensure().required("Reason for Fixed Term required")
    }),
  secondmentEndDate: yup
    .string()
    .ensure()
    .when("permanentChangeType", {
      is: "Secondment",
      then: yup.string().ensure().required("Secondment end date required")
    }),
  secondmentNewEndDate: yup
    .string()
    .ensure()
    .when("secondmentChangeType", {
      is: "Secondment contract extension",
      then: yup.string().ensure().required("Secondment end date required")
    }),
  fixedTermNewEndDate: yup
    .string()
    .ensure()
    .when("fixedTermChangeType", {
      is: "Fixed Term contract extension",
      then: yup.string().ensure().required("Fixed Term end date required")
    }),

  /********** (New) Position Details section *******************************/
  positionDescriptionAttachment: yup
    .array()
    .when(
      [
        "thirdPartyChangeType",
        "casualChangeType",
        "fixedTermChangeType",
        "permanentChangeType"
      ],
      {
        is: (
          thirdPartyChangeType,
          casualChangeType,
          fixedTermChangeType,
          permanentChangeType
        ) => {
          return (
            thirdPartyChangeType ===
              "Change contractor to permanent MYOB employee" ||
            thirdPartyChangeType ===
              "Change contractor to fixed term MYOB employee" ||
            casualChangeType === "Change casual to permanent MYOB employee" ||
            casualChangeType === "Change casual to fixed term MYOB employee" ||
            fixedTermChangeType === "Fixed Term transfer to new position" ||
            permanentChangeType === "Transfer or promotion to new position" ||
            permanentChangeType === "Secondment" ||
            permanentChangeType === "Permanent transfer to Fixed Term" ||
            permanentChangeType === "Permanent transfer to Casual"
          );
        },
        then: yup
          .array()
          .ensure([])
          .required("Mandatory")
          .test("all success", "Some files didn't upload successfully", array =>
            all(v => !isNil(v.uploadedName), array)
          ),
        otherwise: yup.array()
      }
    ),
  newDirectManager: yup
    .object()
    .when(
      [
        "thirdPartyChangeType",
        "casualChangeType",
        "fixedTermChangeType",
        "permanentChangeType",
        "secondmentChangeType",
        "parentalLeaveChangeType"
      ],
      {
        is: (
          thirdPartyChangeType,
          casualChangeType,
          fixedTermChangeType,
          permanentChangeType,
          secondmentChangeType,
          parentalLeaveChangeType
        ) => {
          return (
            thirdPartyChangeType === "Reporting line change" ||
            casualChangeType === "Reporting line change" ||
            fixedTermChangeType === "Reporting line change" ||
            permanentChangeType === "Reporting line change" ||
            secondmentChangeType === "Reporting line change" ||
            parentalLeaveChangeType === "Reporting line change"
          );
        },
        then: yup.object().required("Select a new manager")
      }
    ),
  function: yup.object().when("thirdPartyChangeType", {
    is: "Contractor's end date extension",
    then: yup.object(),
    otherwise: yup.object().required("Select a function")
  }),
  group: yup.object().when("thirdPartyChangeType", {
    is: "Contractor's end date extension",
    then: yup.object(),
    otherwise: yup.object().required("Select a group")
  }),
  vertical: yup.object().when("thirdPartyChangeType", {
    is: "Contractor's end date extension",
    then: yup.object(),
    otherwise: yup.object().required("Select a vertical")
  }),
  teamMemberLevel: yup
    .string()
    .when(
      [
        "thirdPartyChangeType",
        "casualChangeType",
        "fixedTermChangeType",
        "permanentChangeType",
        "secondmentChangeType",
        "parentalLeaveChangeType"
      ],
      {
        is: (
          thirdPartyChangeType,
          casualChangeType,
          fixedTermChangeType,
          permanentChangeType,
          secondmentChangeType,
          parentalLeaveChangeType
        ) => {
          return (
            thirdPartyChangeType === "Reporting line change" ||
            thirdPartyChangeType === "Contractor's end date extension" ||
            casualChangeType === "Reporting line change" ||
            fixedTermChangeType === "Reporting line change" ||
            permanentChangeType === "Reporting line change" ||
            secondmentChangeType === "Reporting line change" ||
            parentalLeaveChangeType === "Reporting line change"
          );
        },
        then: yup.string(),
        otherwise: yup.string().required("Select team member level")
      }
    ),
  positionTitle: yup
    .string()
    .when(
      [
        "thirdPartyChangeType",
        "casualChangeType",
        "fixedTermChangeType",
        "permanentChangeType",
        "secondmentChangeType",
        "parentalLeaveChangeType"
      ],
      {
        is: (
          thirdPartyChangeType,
          casualChangeType,
          fixedTermChangeType,
          permanentChangeType,
          secondmentChangeType,
          parentalLeaveChangeType
        ) => {
          return (
            thirdPartyChangeType === "Reporting line change" ||
            thirdPartyChangeType === "Contractor's end date extension" ||
            casualChangeType === "Reporting line change" ||
            fixedTermChangeType === "Reporting line change" ||
            permanentChangeType === "Reporting line change" ||
            secondmentChangeType === "Reporting line change" ||
            parentalLeaveChangeType === "Reporting line change"
          );
        },
        then: yup.string(),
        otherwise: yup.string().required("Select position title")
      }
    ),
  directManager: yup
    .object()
    .when(
      [
        "thirdPartyChangeType",
        "casualChangeType",
        "fixedTermChangeType",
        "permanentChangeType",
        "secondmentChangeType",
        "parentalLeaveChangeType"
      ],
      {
        is: (
          thirdPartyChangeType,
          casualChangeType,
          fixedTermChangeType,
          permanentChangeType,
          secondmentChangeType,
          parentalLeaveChangeType
        ) => {
          return (
            thirdPartyChangeType === "Reporting line change" ||
            thirdPartyChangeType === "Contractor's end date extension" ||
            casualChangeType === "Reporting line change" ||
            fixedTermChangeType === "Reporting line change" ||
            permanentChangeType === "Reporting line change" ||
            secondmentChangeType === "Reporting line change" ||
            parentalLeaveChangeType === "Reporting line change"
          );
        },
        then: yup.object(),
        otherwise: yup.object().required("Select manager")
      }
    ),
  costCentreChangeRequired: yup.array().ensure(),
  costCentre: yup.object().when("costCentreChangeRequired", {
    is: changeRequired =>
      Array.from(changeRequired).includes("costCentreChange"),
    then: yup.object().required("Select cost centre")
  }),
  codeRequired: yup.array().ensure(),
  projectType: yup.string().when("codeRequired", {
    is: codeRequired => Array.from(codeRequired).includes("requiresCostCode"),
    then: yup.string().required("Select project type")
  }),
  projectCostCentre: yup.object().when("codeRequired", {
    is: codeRequired => Array.from(codeRequired).includes("requiresCostCode"),
    then: yup.object().required("Select cost centre")
  }),
  carAllowanceRequired: yup.array().ensure(),
  carAllowanceAmount: yup.string().when("carAllowanceRequired", {
    is: allowanceRequired =>
      Array.from(allowanceRequired).includes("carAllowance"),
    then: yup.string().required("Select car allowance")
  }),

  /********** Agreement Details section *******************************/

  locationChange: yup.array().ensure(),
  primaryOffice: yup.string().when("locationChange", {
    is: locationChange =>
      Array.from(locationChange).includes("locationChangeRequired"),
    then: yup.string().required("Select office")
  }),
  hoursChange: yup.array().ensure(),
  workingHoursOptions: yup.string().ensure(),
  numberOfHoursPerWeek: yup
    .number()
    .when(["hoursChange", "workingHoursOptions"], {
      is: (hoursChange, workingHoursOptions) => {
        return (
          workingHoursOptions === "Part Time Hours" &&
          Array.from(hoursChange).includes("hoursChangeRequired")
        );
      },
      then: yup
        .number()
        .nullable(true)
        .transform((v, o) => (o === "" ? null : v))
        .min(5, "Enter the correct number of hours")
        .max(40, "Enter the correct number of hours")
        .required("Enter the correct number of hours")
    }),
  usualDays: yup.string().when(["hoursChange", "workingHoursOptions"], {
    is: (hoursChange, workingHoursOptions) => {
      return (
        workingHoursOptions === "Part Time Hours" &&
        Array.from(hoursChange).includes("hoursChangeRequired")
      );
    },
    then: yup.string().required("Enter the usual days or work pattern")
  }),
  salaryChange: yup
    .array()
    .ensure()
    .when(
      [
        "casualChangeType",
        "fixedTermChangeType",
        "permanentChangeType",
        "thirdPartyChangeType"
      ],
      {
        is: (
          casualChangeType,
          fixedTermChangeType,
          permanentChangeType,
          thirdPartyChangeType
        ) => {
          return (
            casualChangeType === "Change casual to fixed term MYOB employee" ||
            casualChangeType === "Change casual to permanent MYOB employee" ||
            fixedTermChangeType === "Fixed Term transfer to permanent" ||
            fixedTermChangeType === "Fixed Term transfer to new position" ||
            permanentChangeType === "Permanent transfer to Fixed Term" ||
            permanentChangeType === "Permanent transfer to Casual" ||
            thirdPartyChangeType ===
              "Change contractor to permanent MYOB employee" ||
            thirdPartyChangeType ===
              "Change contractor to fixed term MYOB employee"
          );
        },
        then: yup.array().required("Salary change required")
      }
    ),
  baseSalary: yup.number().when(["salaryChange", "permanentChangeType"], {
    is: (allowanceRequired, permanentChangeType) =>
      Array.from(allowanceRequired).includes("salaryChangeRequired") &&
      permanentChangeType !== "Permanent transfer to Casual",
    then: yup
      .number()
      .nullable(true)
      .transform((v, o) => (o === "" ? null : v))
      .min(10000, "Salary cannot be less than ${min}")
      .required("Enter the correct base salary amount")
  }),
  casualHourlyRate: yup.number().when("permanentChangeType", {
    is: "Permanent transfer to Casual",
    then: yup
      .number()
      .nullable(true)
      .transform((v, o) => (o === "" ? null : v))
      .min(1, "Please enter the correct hourly rate")
      .required("Please enter the correct hourly rate")
  }),
  commission: yup.array().ensure(),
  changeOfCommission: yup.string().when("commission", {
    is: commission => Array.from(commission).includes("commissionRequired"),
    then: yup.string().ensure().required("Select yes / no")
  }),
  onTargetEarnings: yup.number().when("changeOfCommission", {
    is: "Yes",
    then: yup
      .number()
      .nullable(true)
      .transform((v, o) => (o === "" ? null : v))
      .min(1, "OTE cannot be less than ${min}")
      .required("Enter OTE")
  }),
  commissionPaymentFrequency: yup.string().when("changeOfCommission", {
    is: "Yes",
    then: yup.string().required("Select payment frequency")
  }),

  /********** Finance Details section *******************************/

  creditCard: yup.array().ensure(),
  creditLimit: yup
    .number()
    .nullable(true)
    .transform((v, o) => (o === "" ? null : v))
    .when(["primaryOffice", "creditCard"], {
      is: (primaryOffice, creditCard) =>
        String(primaryOffice).startsWith("AU") &&
        Array.from(creditCard).includes("creditCardIsRequired"),
      then: yup
        .number()
        .min(1, "Credit limit cannot be less than ${min}")
        .max(5000, "Maximum limit is ${max}")
        .required("Please enter a number")
    })
    .when(["primaryOffice", "creditCard"], {
      is: (primaryOffice, creditCard) =>
        !String(primaryOffice).startsWith("AU") &&
        Array.from(creditCard).includes("creditCardIsRequired"),
      then: yup
        .number()
        .min(1, "Credit limit cannot be less than ${min}")
        .max(3000, "Maximum limit is  ${max}")
        .required("Enter credit limit")
    }),
  delegatedApprovalAuthority: yup.array().ensure(),
  approvalLimit: yup
    .number()
    .nullable(true)
    .transform((v, o) => (o === "" ? null : v))
    .when(["teamMemberLevel", "delegatedApprovalAuthority"], {
      is: (teamMemberLevel, delegatedApprovalAuthority) =>
        String(teamMemberLevel) === "ELT" &&
        Array.from(delegatedApprovalAuthority).includes(
          "hasDelegatedApprovalAuthority"
        ),
      then: yup
        .number()
        .min(1, "Approval limit cannot be less than ${min}")
        .max(500000, "ELT level has a capped approval limit of ${max}")
        .required("Enter approval limit")
    })
    .when(["teamMemberLevel", "delegatedApprovalAuthority"], {
      is: (teamMemberLevel, delegatedApprovalAuthority) =>
        String(teamMemberLevel) === "SLT" &&
        Array.from(delegatedApprovalAuthority).includes(
          "hasDelegatedApprovalAuthority"
        ),
      then: yup
        .number()
        .min(1, "Approval limit cannot be less than ${min}")
        .max(150000, "SLT level has a capped approval limit of ${max}")
        .required("Enter approval limit")
    }),
  financeAttachments: yup
    .array()
    .when(["creditCard", "delegatedApprovalAuthority"], {
      is: (creditCard, delegatedApprovalAuthority) =>
        Array.from(creditCard).includes("creditCardIsRequired") ||
        Array.from(delegatedApprovalAuthority).includes(
          "hasDelegatedApprovalAuthority"
        ),
      then: yup
        .array()
        .ensure([])
        .required("Mandatory")
        .test("all success", "Some files didn't upload successfully", array =>
          all(v => !isNil(v.uploadedName), array)
        )
    }),

  /********** IT Details section *******************************/

  computerChange: yup.array().ensure(),
  computerHardware: yup.string().when("computerChange", {
    is: computerChange =>
      Array.from(computerChange).includes("computerChangeRequired"),
    then: yup.string().required("Select a computer")
  }),
  isGenesysRequired: yup.array().ensure(),
  genesysAgentGroup: yup.string().when("isGenesysRequired", {
    is: genesysRequired =>
      Array.from(genesysRequired).includes("isGenesysRequired"),
    then: yup.string().required("Select a Genesys agent group")
  }),
  genesysAccessBasedOn: yup.object().when("isGenesysRequired", {
    is: genesysRequired =>
      Array.from(genesysRequired).includes("isGenesysRequired"),
    then: yup.object().required("Select a user")
  }),
  isPortACurrentNumberRequired: yup.array().ensure(),
  currentPhoneNumber: yup
    .number()
    .nullable(true)
    .transform((v, o) => (o === "" ? null : v))
    .min(1, "Enter a valid phone number")
    .when("isPortACurrentNumberRequired", {
      is: isPortACurrentNumberRequired =>
        Array.from(isPortACurrentNumberRequired).includes(
          "isPortACurrentNumberRequired"
        ),
      then: yup.number().required("Enter the current phone number")
    }),
  currentServiceProvider: yup.string().when("isPortACurrentNumberRequired", {
    is: isPortACurrentNumberRequired =>
      Array.from(isPortACurrentNumberRequired).includes(
        "isPortACurrentNumberRequired"
      ),
    then: yup.string().required("Enter the current service provider")
  }),
  software: yup.array().ensure(),
  archieAccessBasedOn: yup.object().when("software", {
    is: software => Array.from(software).includes("archie"),
    then: yup.object().required("Select a user")
  }),
  reportingLineManager: yup.object().when("software", {
    is: software => Array.from(software).includes("archie"),
    then: yup.object().required("Select a user")
  }),
  countryAccess: yup
    .array()
    .ensure()
    .when("software", {
      is: software => Array.from(software).includes("archie"),
      then: yup.array().required("Select country")
    }),
  archieAnalyticsAccessBasedOn: yup.object().when("software", {
    is: software => Array.from(software).includes("archieAnalytics"),
    then: yup.object().required("Select a user")
  }),
  banklinkAccessBasedOn: yup.object().when("software", {
    is: software => Array.from(software).includes("banklink"),
    then: yup.object().required("Select a user")
  }),
  banklinkAccessRequired: yup
    .array()
    .ensure()
    .when("software", {
      is: software => Array.from(software).includes("banklink"),
      then: yup.array().required("Select Banklink access")
    }),
  zendeskInstance: yup
    .array()
    .ensure()
    .when("software", {
      is: software => Array.from(software).includes("zendesk"),
      then: yup.array().required("Select a Zendesk instance")
    }),
  zendeskQueue: yup.string().when("software", {
    is: software => Array.from(software).includes("zendesk"),
    then: yup
      .string()
      .required("Enter a valid Zendesk queue name otherwise type in N/A")
  }),
  otherSoftware: yup.string().when("software", {
    is: software => Array.from(software).includes("other"),
    then: yup.string().required("Enter the software")
  }),
  cancelReason: yup.string()
});
