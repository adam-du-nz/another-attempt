export const commonMetaData = {
  teamMemberLevel: {
    NAME: "teamMemberLevel",
    LABEL: "Team Member Level",
    OPTIONS: [
      { name: "teamMember", label: "Team Member" },
      { name: "peopleLeader", label: "People Leader" },
      { name: "SLT", label: "SLT" },
      { name: "ELT", label: "ELT" }
    ]
  },
  positionTitle: {
    NAME: "positionTitle",
    LABEL: "Position Title"
  },
  directManager: {
    NAME: "directManager",
    LABEL: "Direct Manager"
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
  },
  projectCostCentres: {
    codeRequired: {
      NAME: "codeRequired",
      LABEL: "Project Cost Code",
      OPTIONS: [
        {
          name: "requiresCostCode",
          label: "Project Cost Code required"
        }
      ]
    },
    projectType: {
      NAME: "projectType",
      LABEL: "Project Type",
      OPTIONS: [
        { name: "oneOff", label: "One off project (below the line)" },
        { name: "capex", label: "Capital project (capex)" },
        { name: "BAU", label: "BAU project (reporting only)" }
      ]
    },
    projectCostCentre: {
      NAME: "projectCostCentre",
      LABEL: "Project Cost Centre"
    }
  },
  primaryOffice: {
    NAME: "primaryOffice",
    LABEL: "Primary Office",
    OPTIONS: [
      { name: "au-sydney", label: "AU - Sydney" },
      { name: "au-melbourne-cremorne", label: "AU - Melbourne - Cremorne" },
      { name: "au-melbourne-abbotsford", label: "AU - Melbourne - Abbotsford" },
      { name: "au-adelaide", label: "AU - Adelaide" },
      { name: "au-perth", label: "AU - Perth" },
      { name: "au-brisbane", label: "AU - Brisbane" },
      { name: "au-brisbane-rivergate", label: "AU - Brisbane - Rivergate" },
      { name: "au-hobart", label: "AU - Hobart" },
      { name: "au-remote-office", label: "AU - Remote Office" },
      { name: "nz-auckland", label: "NZ - Auckland" },
      { name: "nz-hastings", label: "NZ - Hastings" },
      { name: "nz-christchurch", label: "NZ - Christchurch" },
      { name: "nz-remote-office", label: "NZ - Remote Office" }
    ]
  },
  relocationExpenses: {
    NAME: "relocationExpenses",
    LABEL: "Relocation Expenses",
    OPTIONS: [
      { label: "Relocation Expenses Included", name: "relocationExpenses" }
    ]
  },
  remoteWork: {
    NAME: "remoteWork",
    LABEL: "Remote Work",
    OPTIONS: [
      {
        name: "remoteWork",
        label: "This employee will be working remotely most of the time"
      }
    ]
  },
  casualHourlyRate: {
    NAME: "casualHourlyRate",
    LABEL: "Hourly Rate"
  },
  commission: {
    NAME: "commission",
    LABEL: "Commission",
    OPTIONS: [{ label: "Commission required ", name: "commissionRequired" }]
  },
  onTargetEarnings: {
    NAME: "onTargetEarnings",
    LABEL: "Annual on target earnings (OTE)"
  },
  commissionPaymentFrequency: {
    NAME: "commissionPaymentFrequency",
    LABEL: "Commission payment frequency",
    OPTIONS: [
      { name: "monthly", label: "Monthly" },
      { name: "quarterly", label: "Quarterly" }
    ],
    PLACEHOLDER: "Please choose the payment frequency"
  },
  financeDetails: {
    creditCard: {
      NAME: "creditCard",
      LABEL: "Credit Card",
      OPTIONS: [{ name: "creditCardIsRequired", label: "Credit card required" }]
    },
    creditLimit: {
      NAME: "creditLimit",
      LABEL: "Credit Limit"
    },
    delegatedApprovalAuthority: {
      NAME: "delegatedApprovalAuthority",
      LABEL: "Delegated Approval",
      OPTIONS: [
        {
          name: "hasDelegatedApprovalAuthority",
          label: "Does this role have delegated approval authority?"
        }
      ]
    },
    approvalLimit: {
      NAME: "approvalLimit",
      LABEL: "Approval Limit"
    }
  },
  localAdmin: {
    NAME: "localAdmin",
    LABEL: "Local Admin",
    OPTIONS: [
      {
        name: "localAdminAccessRequired",
        label: "Local Admin Access required"
      }
    ]
  },
  computerHardware: {
    NAME: "computerHardware",
    LABEL: "Computer Hardware",
    PLACEHOLDER: "Please choose computer hardware"
  },
  phoneSystems: {
    isGenesysRequired: {
      NAME: "isGenesysRequired",
      LABEL: "Genesys",
      OPTIONS: [
        {
          name: "isGenesysRequired",
          label: "Genesys required"
        }
      ]
    },
    genesysAgentGroup: {
      NAME: "genesysAgentGroup",
      LABEL: "Which Group will the new agent be part of?",
      PLACEHOLDER: "Please choose a genesys agent group",
      OPTIONS: [
        { name: "FST", label: "FST - Financial Services" },
        {
          name: "PSSO",
          label: "PSSO - Premium Support and Service Optimisation"
        },
        { name: "SCS", label: "SCS - SME Client Support" },
        { name: "AUDS", label: "AUDS - Australia Direct Sales" },
        { name: "NZDS", label: "NZDS - New Zealand Direct Sales" },
        { name: "SKF", label: "SKF - Campaign SCS" },
        { name: "RetentionSpecialist", label: "Retention Specialist " }
      ]
    },
    genesysAccessBasedOn: {
      NAME: "genesysAccessBasedOn",
      LABEL: "Genesys Setup Based on"
    },
    teamsDirectNumber: {
      NAME: "teamsDirectNumber",
      LABEL: "Microsoft Teams direct number",
      OPTIONS: [
        {
          name: "teamsDirectNumberRequired",
          label:
            "Direct number required (only required for making telephone calls to external clients or customers from MS Teams)"
        }
      ]
    }
  },
  mobilePhone: {
    isMobilePhoneRequired: {
      NAME: "isMobilePhoneRequired",
      LABEL: "Mobile Phone",
      OPTIONS: [
        { name: "isMobilePhoneRequired", label: "Mobile phone required" }
      ]
    },
    isPortACurrentNumberRequired: {
      NAME: "isPortACurrentNumberRequired",
      LABEL: "Port a current number",
      OPTIONS: [
        {
          name: "isPortACurrentNumberRequired",
          label: "Port a current number required"
        }
      ]
    },
    currentPhoneNumber: {
      NAME: "currentPhoneNumber",
      LABEL: "Current Phone Number"
    },
    currentServiceProvider: {
      NAME: "currentServiceProvider",
      LABEL: "Current Service Provider"
    }
  },
  networkDrives: {
    NAME: "networkDrives",
    LABEL: "Network Drives"
  },
  software: {
    software: {
      NAME: "software",
      LABEL: "Software",
      OPTIONS: [
        { name: "archie", label: "Archie" },
        { name: "archieAnalytics", label: "Archie Analytics" },
        { name: "banklink", label: "Banklink" },
        { name: "gong", label: "Gong (Customer Success and Sales only)" },
        { name: "jira", label: "Jira" },
        {
          name: "linkedInSalesNavigator",
          label: "LinkedIn Sales Navigator (Sales only)"
        },
        { name: "livePreso", label: "LivePreso (Sales only)" },
        { name: "miro", label: "Miro" },
        { name: "navision", label: "Navision (Finance only)" },
        { name: "payGlobal", label: "PayGlobal" },
        {
          name: "PBCS/Hyperion",
          label: "PBCS/Hyperion (SLT, CA’s and Finance only)"
        },
        { name: "phoenix", label: "Phoenix" },
        { name: "salesforce", label: "Salesforce" },
        { name: "tableau", label: "Tableau" },
        { name: "teamviewer", label: "TeamViewer" },
        { name: "vPlaybook", label: "vPlaybook (Sales only)" },
        { name: "zendesk", label: "Zendesk (Agent Licence)" },
        { name: "other", label: "Other" }
      ]
    },
    archieAccessBasedOn: {
      NAME: "archieAccessBasedOn",
      LABEL: "Archie Access Based on"
    },
    reportingLineManager: {
      NAME: "reportingLineManager",
      LABEL: "Reporting Line Manager"
    },
    countryAccess: {
      NAME: "countryAccess",
      LABEL: "Country Access",
      OPTIONS: [
        { name: "australia", label: "Australia" },
        { name: "newZealand", label: "New Zealand" }
      ]
    },
    thisEmployeeIsAManagerInArchie: {
      NAME: "thisEmployeeIsAManagerInArchie",
      LABEL: "Archie Manager",
      OPTIONS: [
        {
          name: "thisEmployeeIsAManagerInArchie",
          label: "This employee is a manager in Archie"
        }
      ]
    },
    archieTextBox: {
      NAME: "commentOnArchie",
      LABEL: "Additional comments for Archie"
    },
    archieAnalyticsAccessBasedOn: {
      NAME: "archieAnalyticsAccessBasedOn",
      LABEL: "Archie Analytics access based on"
    },
    banklinkAccessBasedOn: {
      NAME: "banklinkAccessBasedOn",
      LABEL: "Banklink access based on"
    },
    banklinkAccessRequired: {
      NAME: "banklinkAccessRequired",
      LABEL: "Banklink access required",
      OPTIONS: [
        { name: "CHN (CSA/DSA)", label: "CHN (CSA/DSA)" },
        { name: "core", label: "Core" }
      ]
    },
    otherSoftware: {
      NAME: "otherSoftware",
      LABEL: "Other software required"
    },
    zendeskInstance: {
      NAME: "zendeskInstance",
      LABEL: "Select Zendesk Instance",
      OPTIONS: [
        { name: "helpMe", label: "Zendesk - Help Me" },
        { name: "secureZendesk", label: "Secure - Zendesk" },
        { name: "pit", label: "Zendesk - PIT" },
        { name: "accountReceivable", label: "Zendesk - Account Receivable" },
        { name: "payBySupport", label: "Zendesk - Pay By Support" },
        { name: "myobApi", label: "Zendesk - MYOB API" },
        { name: "salesIntegrity", label: "Zendesk - Sales Integrity" },
        { name: "smeOps", label: "Zendesk - SME Ops" }
      ]
    },
    zendeskQueue: {
      NAME: "zendeskQueue",
      LABEL: "Provide Zendesk Queue Name"
    },
    salesforceProvision: {
      NAME: "salesforceProvision",
      LABEL: "Salesforce (+)",
      OPTIONS: [
        {
          name: "salesforceProvisionIsRequired",
          label: "Client Support Representative - Tier 1"
        }
      ]
    },
    teamviewerLicenseType: {
      NAME: "teamviewerLicenseType",
      LABEL: "TeamViewer License Type",
      OPTIONS: [
        "TeamViewer Lite - Up to 19 connections per month ($1000)",
        "TeamViewer Full - 20+ connections per month ($1300)"
      ]
    },
    tableauAccessType: {
      NAME: "tableauAccessType",
      LABEL: "Tableau Access Type",
      OPTIONS: ["Viewer", "Explorer", "Creator"]
    }
  },
  cancelReason: {
    NAME: "cancelReason",
    LABEL: "Cancel Reason"
  },
  probationPeriod: {
    NAME: "fixedTermProbationPeriod",
    LABEL: "Fixed Term Probation Period (Month)"
  }
};
