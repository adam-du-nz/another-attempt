export const onboardingFormMetaData = {
  employeeDetails: {
    legalFirstName: {
      NAME: "legalFirstName",
      LABEL: "Legal First Name"
    },
    preferredFirstName: {
      NAME: "preferredFirstName",
      LABEL: "Preferred First Name"
    },
    surname: {
      NAME: "surname",
      LABEL: "Surname"
    },
    email: {
      NAME: "email",
      LABEL: "Email"
    },
    isNotLivingInAnz: {
      NAME: "isLivingInNZ",
      LABEL: "ANZ Residency",
      OPTIONS: [
        {
          name: "isNotLivingInAnz",
          label: "This candidate isn't currently living in AU or NZ"
        }
      ]
    },
    phoneNumber: {
      NAME: "phoneNumber",
      LABEL: "Mobile Phone No."
    },
    firstDayContact: {
      NAME: "firstDayContact",
      LABEL: "First Day Contact"
    },
    tShirtSize: {
      NAME: "tShirtSize",
      LABEL: "T-Shirt Size",
      OPTIONS: [
        { name: "femaleSmall", label: "Female - Small" },
        { name: "femaleMedium", label: "Female - Medium" },
        { name: "femaleLarge", label: "Female - Large" },
        { name: "femaleXl", label: "Female - XL" },
        { name: "femaleXxl", label: "Female - XXL" },
        { name: "femaleXxxl", label: "Female - XXXL" },
        { name: "maleSmall", label: "Male - Small" },
        { name: "maleMedium", label: "Male - Medium" },
        { name: "maleLarge", label: "Male - Large" },
        { name: "maleXl", label: "Male - XL" },
        { name: "maleXxl", label: "Male - XXL" },
        { name: "maleXxxl", label: "Male - XXXL" },
        { name: "unknown", label: "Unknown" }
      ]
    },
    workingRightsOptions: {
      NAME: "workingRightsOptions",
      LABEL: "Working Rights Options",
      OPTIONS: [
        { name: "currentWorkingRights", label: "Current Working Rights" },
        { name: "visaSponsorshipRequired", label: "Visa Sponsorship Required" },
        {
          name: "visaVariationTransferRequired",
          label: "Visa Variation/Transfer Required"
        }
      ]
    },
    employmentTypeOptions: {
      NAME: "employmentTypeOptions",
      LABEL: "Employment Type Options",
      OPTIONS: [
        { name: "permanent", label: "Permanent" },
        { name: "fixedTerm", label: "Fixed Term" },
        { name: "casual", label: "Casual" }
      ]
    },
    fixedTermReason: {
      NAME: "fixedTermReason",
      LABEL: "Reason for Fixed-Term"
    },
    startDate: {
      NAME: "startDate",
      LABEL: "Start Date"
    },
    startTime: {
      NAME: "startTime",
      LABEL: "Start Time"
    },
    endDate: {
      NAME: "endDate",
      LABEL: "End Date"
    }
  },
  agreementDetails: {
    workingHoursOptions: {
      NAME: "workingHoursOptions",
      LABEL: "Working Hours Options",
      OPTIONS: ["Full Time Hours", "Part Time Hours"]
    },
    numberOfHoursPerWeek: {
      NAME: "numberOfHoursPerWeek",
      LABEL: "Number of Hours per Week",
      PLACEHOLDER: "e.g. 10"
    },
    usualDays: {
      NAME: "usualDays",
      LABEL: "Usual Days or pattern of week each week"
    },
    baseSalary: {
      NAME: "baseSalary",
      LABEL: "Base Salary",
      PLACEHOLDER: "e.g. 50,000"
    },
    superannuation: {
      NAME: "superannuation",
      LABEL: "Superannuation"
    },
    totalSalary: {
      NAME: "totalSalary",
      LABEL: "Total Salary"
    },
    casualHourlyRate: {
      NAME: "casualHourlyRate",
      LABEL: "Hourly Rate"
    },
    commentsOnAgreement: {
      NAME: "commentsOnAgreement",
      LABEL: "Comments on Agreement "
    }
  },
  itDetails: {
    sharedMailbox: {
      NAME: "sharedMailbox",
      LABEL:
        "Please provide a shared mailbox name or distribution list group name to be added for the new user"
    },
    additionalItAccess: {
      NAME: "additionalItAccess",
      LABEL: "Additional IT access required",
      PLACEHOLDER: "Please be specific, it cannot be copying someone's profile"
    }
  },
  positionDetails: {
    casualProjectDescription: {
      NAME: "casualProjectDescription",
      LABEL: "Casual Project Description"
    },
    costCentre: {
      NAME: "costCentre",
      LABEL: "Cost Centre"
    },
    driversLicence: {
      NAME: "driversLicence",
      LABEL: "Driver's Licence",
      OPTIONS: [
        {
          name: "driversLicenceRequired",
          label: "A driver's licence is required for this role"
        }
      ]
    },
    onCall: {
      NAME: "onCall",
      LABEL: "On-Call",
      OPTIONS: [
        {
          name: "onCallRequired",
          label: "On-call is a requirement for this role"
        }
      ]
    },
    shiftWork: {
      NAME: "shiftWork",
      LABEL: "Shift Work",
      OPTIONS: [
        {
          name: "shiftWorkRequired",
          label: "Shift work is a requirement for this role"
        }
      ]
    },
    commentsOnPosition: {
      NAME: "commentsOnPosition",
      LABEL: "Comments on Position"
    }
  },
  employeeServicesSection: {
    ebpPercentage: {
      NAME: "ebpPercentage",
      LABEL: "EBP Percentage"
    },
    sendEBP: {
      NAME: "sendEBP",
      OPTIONS: [
        {
          name: "shouldSendEbp",
          label: "Send EBP"
        }
      ]
    },
    awaitingVisa: {
      NAME: "awaitingVisa",
      OPTIONS: [
        {
          name: "awaitingVisa",
          label: "Awaiting Visa"
        }
      ]
    }
  },
  bulkOnboardingDetails: {
    isAcquisition: {
      NAME: "isAcquisition",
      LABEL: "Acquisition",
      OPTIONS: [
        {
          name: "acquisition",
          label: "Is this part of an Acquisition?"
        }
      ]
    },
    companyName: {
      NAME: "companyName",
      LABEL: "Original Company"
    },
    originalStartDate: {
      NAME: "originalStartDate",
      LABEL: "Original Start Date"
    },
    acquisitionDate: {
      NAME: "acquisitionDate",
      LABEL: "Acquisition Date"
    }
  }
};
