import * as yup from "yup";
import { all, isNil } from "ramda";

export const thirdPartyContractorFormSchema = yup.object().shape({
  /** Contract Details **/
  managerName: yup.object().required("Please select a manager"),
  hasCurrentConsultancyAgreement: yup.string().required("Mandatory"),
  companyName: yup.string().required("Mandatory"),
  companyAddress: yup.string().required("Mandatory"),
  companyTaxNumber: yup.string().required("Mandatory"),
  /** Contractor Details **/
  preferredFirstName: yup.string().required("Mandatory"),
  surname: yup.string().required("Mandatory"),
  email: yup.string().email().required("Mandatory"),
  mobileNumber: yup
    .number()
    .nullable(true)
    .transform((v, o) => (o === "" ? null : v))
    .min(0, "Please enter a valid mobile number")
    .required("Please enter a valid mobile number"),
  /** Contractor Position Details **/
  positionTitle: yup.string().required("Please enter the position title"),
  startDate: yup
    .string()
    .matches(
      /\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/, // regex to match yyyy-mm-dd
      "Please pick a valid date"
    )
    .required("Please enter a start date"),
  endDate: yup
    .string()
    .matches(
      /\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/, // regex to match yyyy-mm-dd
      "Please pick a valid date"
    )
    .required("Please enter an end date"),
  location: yup.string().required("Please choose a location"),
  otherLocation: yup.string().when("location", {
    is: "Other (Please Specify below)",
    then: yup.string().required("Please specify location")
  }),
  function: yup.object().required("Please choose a function"),
  group: yup.object().required("Please choose a group"),
  vertical: yup.object().required("Please choose a vertical"),
  /** IT Details **/
  hasOwnHardware: yup.string().required("Mandatory"),
  localAdmin: yup.array().nullable(true),
  computerHardware: yup.string().when("hasOwnHardware", {
    is: "No",
    then: yup.string().required("Please select a model")
  }),
  isNetworkAccessRequired: yup.string().required("Mandatory"),
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
  /** Attach Documents **/
  attachments: yup
    .array()
    .ensure([])
    .required("Mandatory")
    .test("all success", "Some files didn't upload successfully", array =>
      all(v => !isNil(v.uploadedName), array)
    )
});
