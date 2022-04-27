export const roleUpdateMetaData = {
  employeeDetails: {
    employeeName: {
      NAME: "employee",
      LABEL: "Employee"
    }
  },
  changeType: {
    // Common (i.e. used across multiple change types)
    changeApproved: {
      NAME: "changeApproved",
      LABEL: "Approved",
      OPTIONS: [
        {
          name: "isApproved",
          label: "This change has been approved"
        }
      ]
    },
    effectiveDate: {
      NAME: "effectiveDate",
      LABEL: "Effective Date"
    },
    temporaryTermsChange: {
      NAME: "temporaryTermsChange",
      LABEL: "Temporary terms change",
      OPTIONS: [
        {
          name: "isTemporary",
          label: "The change in terms is temporary"
        }
      ]
    },
    temporaryTermsEndDate: {
      NAME: "temporaryTermsEndDate",
      LABEL: "End Date"
    },
    fixedTermEndDate: {
      NAME: "fixedTermEndDate",
      LABEL: "Fixed Term End Date"
    },
    // Permanent
    permanentChangeType: {
      NAME: "permanentChangeType",
      LABEL: "Change Type",
      OPTIONS: [
        {
          name: "transferPromotion",
          label: "Transfer or promotion to new position"
        },
        { name: "secondment", label: "Secondment" },
        {
          name: "permanentChangeTerms",
          label: "Change the terms of current role"
        },
        { name: "permanentReportingLine", label: "Reporting line change" },
        { name: "permanentToFixed", label: "Permanent transfer to Fixed Term" },
        { name: "permanentToCasual", label: "Permanent transfer to Casual" }
      ]
    },
    reasonForFixedTerm: {
      NAME: "reasonForFixedTerm",
      LABEL: "Reason for Fixed Term"
    },
    // Fixed-term
    fixedTermChangeType: {
      NAME: "fixedTermChangeType",
      LABEL: "Change Type",
      OPTIONS: [
        {
          name: "fixedTermContractExtension",
          label: "Fixed Term contract extension"
        },
        {
          name: "fixedTermToPermanent",
          label: "Fixed Term transfer to permanent"
        },
        {
          name: "fixedTermTransfer",
          label: "Fixed Term transfer to new position"
        },
        {
          name: "fixedTermChangeTerms",
          label: "Change the terms of current role"
        },
        { name: "fixedTermReportingLine", label: "Reporting line change" }
      ]
    },
    fixedTermNewEndDate: {
      NAME: "fixedTermNewEndDate",
      LABEL: "Fixed Term New End Date"
    },
    // Third-party contractor
    thirdPartyChangeType: {
      NAME: "thirdPartyChangeType",
      LABEL: "Change Type",
      OPTIONS: [
        {
          name: "thirdPartyToPermanent",
          label: "Change contractor to permanent MYOB employee"
        },
        {
          name: "thirdPartyToFixedTerm",
          label: "Change contractor to fixed term MYOB employee"
        },
        {
          name: "thirdPartyExtension",
          label: "Contractor's end date extension"
        },
        { name: "thirdPartyReportingLine", label: "Reporting line change" }
      ]
    },
    contractorCurrentEndDate: {
      NAME: "contractorCurrentEndDate",
      LABEL: "Contractor's Current End Date"
    },
    contractorNewEndDate: {
      NAME: "contractorNewEndDate",
      LABEL: "Contractor's New End Date"
    },
    contractorAcknowledged: {
      NAME: "contractorAcknowledged",
      LABEL: "Confirmation",
      OPTIONS: [
        {
          name: "acknowledged",
          label:
            "I can confirm that the SLA with the 3rd party vendor is still valid at the time of the extension request"
        }
      ]
    },
    // Secondment
    secondmentChangeType: {
      NAME: "secondmentChangeType",
      LABEL: "Change Type",
      OPTIONS: [
        {
          name: "secondmentContractExtension",
          label: "Secondment contract extension"
        },
        {
          name: "secondmentTransfer",
          label: "Permanent transfer following secondment"
        },
        {
          name: "secondmentChangeTerms",
          label: "Change the terms of current role"
        },
        { name: "secondmentReportingLine", label: "Reporting line change" }
      ]
    },
    secondmentEndDate: {
      NAME: "secondmentEndDate",
      LABEL: "Secondment End Date"
    },
    secondmentNewEndDate: {
      NAME: "secondmentNewEndDate",
      LABEL: "Secondment New End Date"
    },
    // Casual
    casualChangeType: {
      NAME: "casualChangeType",
      LABEL: "Change Type",
      OPTIONS: [
        {
          name: "casualToPermanent",
          label: "Change casual to permanent MYOB employee"
        },
        {
          name: "casualToFixedTerm",
          label: "Change casual to fixed term MYOB employee"
        },
        { name: "casualReportingLine", label: "Reporting line change" }
      ]
    },
    // Parental leave
    parentalLeaveChangeType: {
      NAME: "parentalLeaveChangeType",
      LABEL: "Change Type",
      OPTIONS: [
        {
          name: "parentalLeaveReportingLine",
          label: "Reporting line change"
        }
      ]
    }
  },
  newPosition: {
    directManager: {
      NAME: "directManager",
      LABEL: "Direct Manager"
    },
    newDirectManager: {
      NAME: "newDirectManager",
      LABEL: "New Direct Manager"
    },
    costCentreChangeRequired: {
      NAME: "costCentreChangeRequired",
      LABEL: "Change Cost Centre",
      OPTIONS: [
        {
          name: "costCentreChange",
          label: "Change to Cost Centre is required"
        }
      ]
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
    carAllowanceRequired: {
      NAME: "carAllowanceRequired",
      LABEL: "Car Allowance",
      OPTIONS: [
        {
          name: "carAllowance",
          label: "A car allowance is required for this role"
        }
      ]
    },
    carAllowanceAmount: {
      NAME: "carAllowanceAmount",
      LABEL: "Car Allowance Amount",
      OPTIONS: [
        {
          name: "standardAllowance",
          label:
            "Standard Allowance - Regular business travel up to 500kms a week"
        },
        {
          name: "highAllowance",
          label: "High Allowance - Regular business travel over 500kms a week"
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
    },
    updateArchieReportingLine: {
      NAME: "updateArchieReportingLine",
      LABEL: "Update Archie Reporting Line",
      OPTIONS: [
        {
          name: "updateArchieReportingLine",
          label: "Update to Archie Reporting Line required"
        }
      ]
    },
    additionalComments: {
      NAME: "additionalComments",
      LABEL: "Additional Comments"
    }
  },
  agreementDetails: {
    locationChange: {
      NAME: "locationChange",
      LABEL: "Location Change",
      OPTIONS: [
        {
          name: "locationChangeRequired",
          label: "Change of location required"
        }
      ]
    },
    commentsOnLocation: {
      NAME: "commentsOnLocation",
      LABEL: "Comments on Location"
    },
    commission: {
      NAME: "commission",
      LABEL: "Commission",
      OPTIONS: [
        { label: "Role Eligible for Commission", name: "commissionRequired" }
      ]
    },
    changeOfCommission: {
      NAME: "changeOfCommission",
      LABEL: "Change Commission",
      OPTIONS: [
        { name: "yes", label: "Yes" },
        { name: "no", label: "No" }
      ],
      PLACEHOLDER: "Please choose if a commission change is required"
    },
    hoursChange: {
      NAME: "hoursChange",
      LABEL: "Hours Change",
      OPTIONS: [
        {
          name: "hoursChangeRequired",
          label: "Change of hours required"
        }
      ]
    },
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
      LABEL: "Usual Days or pattern of work each week"
    },
    commentsOnHours: {
      NAME: "commentsOnHours",
      LABEL: "Comments on Hours"
    },
    salaryChange: {
      NAME: "salaryChange",
      LABEL: "Salary Change",
      OPTIONS: [
        {
          name: "salaryChangeRequired",
          label: "Change of salary required"
        }
      ]
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
    commentsOnSalary: {
      NAME: "commentsOnSalary",
      LABEL: "Comments on Salary"
    }
  },
  itDetails: {
    computerChange: {
      NAME: "computerChange",
      LABEL: "Computer",
      OPTIONS: [
        {
          name: "computerChangeRequired",
          label: "Change of computer required"
        }
      ]
    },
    phoneSystemChange: {
      NAME: "phoneSystemChange",
      LABEL: "Phone System",
      OPTIONS: [
        {
          name: "phoneSystemChangeRequired",
          label: "Phone system change required"
        }
      ]
    },
    softwareChange: {
      NAME: "softwareChange",
      LABEL: "Software",
      OPTIONS: [
        {
          name: "softwareChangeRequired",
          label: "Change of software required"
        }
      ]
    },
    commentsOnIT: {
      NAME: "commentsOnIT",
      LABEL: "Additional IT access required",
      PLACEHOLDER: "Please be specific, it cannot be copying someone's profile"
    }
  },
  // labels for cancel button on ES section
  cancelButton: {
    cancelTransfer: "Cancel Transfer or Promotion",
    cancelSecondment: "Cancel Secondment",
    cancelChangeOfTerms: "Cancel Change of Terms",
    cancelTransferToFixedTerm: "Cancel Transfer to Fixed Term",
    cancelTransferToCasual: "Cancel Transfer to Casual",
    cancelFixedTermContractExtension: "Cancel Fixed Term Contract Extension",
    cancelFixedTermToPermanent: "Cancel Fixed Term Transfer to Permanent",
    cancelFixedTermToNewPosition: "Cancel Fixed Term Transfer to New Position",
    cancelSecondmentExtension: "Cancel Secondment Extension",
    cancelSecondmentToPermanent: "Cancel Secondment Transfer to Permanent",
    cancelCasualToPermanent: "Cancel Casual to Permanent",
    cancelCasualToFixedTerm: "Cancel Casual to Fixed Term",
    cancelContractorToPermanent: "Cancel Contractor to Permanent",
    cancelContractorToFixedTerm: "Cancel Contractor to Fixed Term",
    cancelContractorContractExtension: "Cancel 3rd Party Contract Extension"
  }
};
