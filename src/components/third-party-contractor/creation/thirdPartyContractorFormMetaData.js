export const thirdPartyContractorFormMetaData = {
  // Contract details
  contractDetails: {
    managerName: {
      NAME: "managerName",
      LABEL:
        "Manager Name (Who will the contractor be reporting to/working for?)"
    },
    managerEmail: {
      NAME: "managerEmail",
      LABEL: "Manager Email Address"
    },
    independentContractorQuestionnaire: {
      NAME: "independentContractorQuestionnaire",
      LABEL: "Independent Contractor Questionnaire completed?",
      OPTIONS: ["Yes", "No"]
    },
    hasCurrentConsultancyAgreement: {
      NAME: "hasCurrentConsultancyAgreement",
      LABEL:
        "Does the Employee Services team have a copy of the Current Consultancy Agreement?",
      OPTIONS: ["Yes", "No (The Employee Services team will be in touch)"]
    },
    companyName: {
      NAME: "companyName",
      LABEL: "Company Name"
    },
    companyAddress: {
      NAME: "companyAddress",
      LABEL: "Company Postal Address"
    },
    companyTaxNumber: {
      NAME: "companyTaxNumber",
      LABEL: "Company ABN number (AU) or IRD number (NZ)"
    }
  },
  contractorDetails: {
    preferredFirstName: {
      NAME: "preferredFirstName",
      LABEL: "Preferred First Name"
    },
    surname: {
      NAME: "surname",
      LABEL: "Last Name"
    },
    email: {
      NAME: "email",
      LABEL: "Email Address (not an MYOB email)"
    },
    mobileNumber: {
      NAME: "mobileNumber",
      LABEL: "Mobile Phone",
      PLACEHOLDER: "Include country code: 61 for AU or 64 for NZ"
    }
  },
  positionDetails: {
    startDate: {
      NAME: "startDate",
      LABEL:
        "Start Date (if unknown, please select the earliest possible start date)"
    },
    endDate: {
      NAME: "endDate",
      LABEL: "End Date (if unknown, select no longer than six months)"
    },
    location: {
      NAME: "location",
      LABEL: "Location",
      OPTIONS: [
        { name: "adelaide", label: "Adelaide" },
        { name: "auckland", label: "Auckland" },
        { name: "bangkok", label: "Bangkok" },
        { name: "brisbane", label: "Brisbane" },
        { name: "christchurch", label: "Christchurch" },
        { name: "hastings", label: "Hastings" },
        { name: "melbourne-cremorne", label: "Melbourne - Cremorne" },
        { name: "perth", label: "Perth" },
        { name: "remote", label: "Remote" },
        { name: "sydney", label: "Sydney" },
        { name: "umhlanga", label: "Umhlanga" },
        { name: "xian", label: "Xi'an" },
        { name: "other", label: "Other (Please Specify below)" }
      ]
    },
    otherLocation: {
      NAME: "otherLocation",
      LABEL: "Specify Other Location"
    },
    function: {
      NAME: "function",
      LABEL: "Function"
    },
    group: {
      NAME: "group",
      LABEL: "Group"
    },
    department: {
      NAME: "department",
      LABEL: "Department"
    },
    team: {
      NAME: "team",
      LABEL: "Team"
    },
    vertical: {
      NAME: "vertical",
      LABEL: "Vertical"
    },
    segment: {
      NAME: "segment",
      LABEL: "Segment"
    }
  },
  itDetails: {
    hasOwnHardware: {
      NAME: "hasOwnHardware",
      LABEL: "Will the contractor be providing their own Hardware?",
      OPTIONS: ["Yes", "No"]
    },
    isNetworkAccessRequired: {
      NAME: "isNetworkAccessRequired",
      LABEL:
        "Will they need access to the MYOB network (using their own or MYOB supplied Hardware)?",
      OPTIONS: ["Yes", "No"]
    },
    emailDistributionGroups: {
      NAME: "emailDistributionGroups",
      LABEL: "Email Distribution Groups",
      PLACEHOLDER:
        "Please list any email groups the Contractor needs to be included in"
    },
    departmentalDrives: {
      NAME: "departmentalDrives",
      LABEL: "Departmental Drives",
      PLACEHOLDER:
        "List the specific drive pathway information for any departmental drives the Contractor needs to have access to"
    },
    isAgentIdForPhoneQueueRequired: {
      NAME: "isAgentIdForPhoneQueueRequired",
      LABEL:
        "Does the New Starter require an Agent ID for logging into a phone Queue?",
      OPTIONS: ["Yes", "No"]
    }
  },
  finalComments: {
    NAME: "comments",
    LABEL:
      "Add anything else we might need to know about the Third Party Contractor"
  }
};
