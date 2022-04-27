export const parentalLeaveFormMetaData = {
  startOfParentalLeave: {
    NAME: "startOfParentalLeave",
    LABEL: "Start of Parental Leave"
  },
  endOfParentalLeave: {
    NAME: "endOfParentalLeave",
    LABEL: "End of Parental Leave"
  },
  secondaryPaidLeaveOptions: {
    NAME: "secondaryPaidLeaveOptions",
    LABEL:
      "Will you be taking your paid leave in one continuous two week period?",
    OPTIONS: [
      "Yes, continuous two week leave period",
      "No, I want to break it up"
    ]
  },
  secondaryUnpaidLeaveOptions: {
    NAME: "secondaryUnpaidLeaveOptions",
    LABEL: "Will you be taking any unpaid parental leave?",
    OPTIONS: ["Yes", "No"]
  },
  secondaryUnpaidLeaveContinuousPeriodOptions: {
    NAME: "secondaryUnpaidLeaveContinuousPeriodOptions",
    LABEL: "Will you be taking your unpaid leave in one continuous period?",
    OPTIONS: [
      "Yes, continuous two week leave period",
      "No, I want to break it up"
    ]
  },
  paidLeaveOptions: {
    NAME: "paidLeaveOptions",
    LABEL:
      "We offer up to 14 weeks MYOB paid parental leave. \n Please select how you would like this paid",
    OPTIONS: [
      "Paid monthly",
      "Paid in one lump sum in the monthly pay following the start of your leave"
    ]
  },
  numberOfWeeksOfPaidLeave: {
    NAME: "numberOfWeeksOfPaidLeave",
    LABEL:
      "Please select how many weeks of MYOB paid Parental Leave you would like to apply for:",
    OPTIONS: [
      { label: "1 Week", name: "1 Week" },
      { label: "2 Weeks", name: "2 Weeks" },
      { label: "3 Weeks", name: "3 Weeks" },
      { label: "4 Weeks", name: "4 Weeks" },
      { label: "5 Weeks", name: "5 Weeks" },
      { label: "6 Weeks", name: "6 Weeks" },
      { label: "7 Weeks", name: "7 Weeks" },
      { label: "8 Weeks", name: "8 Weeks" },
      { label: "9 Weeks", name: "9 Weeks" },
      { label: "10 Weeks", name: "10 Weeks" },
      { label: "11 Weeks", name: "11 Weeks" },
      { label: "12 Weeks", name: "12 Weeks" },
      { label: "13 Weeks", name: "13 Weeks" },
      { label: "14 Weeks", name: "14 Weeks" }
    ]
  },
  typeOfParentalLeave: {
    NAME: "typeOfParentalLeave",
    LABEL: "Type of Parental Leave",
    OPTIONS: [
      { label: "Primary Carer Leave", value: "Primary Carer Leave" },
      {
        label: "Secondary Carer Leave",
        value: "Secondary Carer Leave"
      },
      {
        label: "Sharing Primary Carer Leave",
        value: "Sharing Primary Carer Leave"
      },
      { label: "Surrogacy Leave", value: "Surrogacy Leave" }
    ]
  },
  startOfPayment: {
    NAME: "startOfPayment",
    LABEL:
      "Please select the date you would like to commence your MYOB Paid Parental Leave"
  },
  startOfUnpaidLeaveDatePicker: {
    NAME: "startOfUnpaidLeaveDatePicker",
    LABEL: "Start date of Unpaid Parental Leave"
  },
  startOfWeek1OfNoncontinuousPaidLeave: {
    NAME: "startOfWeek1OfNoncontinuousPaidLeave",
    LABEL: "Start Date of the First Week of Your Noncontinuous Paid Leave"
  },
  startOfWeek2OfNoncontinuousPaidLeave: {
    NAME: "startOfWeek2OfNoncontinuousPaidLeave",
    LABEL: "Start Date of the Second Week of Your Noncontinuous Paid Leave"
  },
  startOfWeek1OfNoncontinuousUnpaidLeave: {
    NAME: "startOfWeek1OfNoncontinuousUnpaidLeave",
    LABEL: "Start Date of the First Week of Your Noncontinuous Unpaid Leave"
  },
  startOfWeek2OfNoncontinuousUnpaidLeave: {
    NAME: "startOfWeek2OfNoncontinuousUnpaidLeave",
    LABEL: "Start Date of the Second Week of Your Noncontinuous Unpaid Leave"
  },
  leaveEntitlements: {
    NAME: "leaveEntitlements",
    LABEL:
      "Are you considering using any leave entitlements in addition to your Parental Leave? ",
    OPTIONS: ["Yes", "No"]
  },
  startOfLeaveEntitlementsDatePicker: {
    NAME: "startOfLeaveEntitlementsDatePicker",
    LABEL: "Start date of leave entitlements"
  },
  endOfLeaveEntitlementsDatePicker: {
    NAME: "endOfLeaveEntitlementsDatePicker",
    LABEL: "End date of leave entitlements"
  },
  newZealandSavingContribution: {
    NAME: "newZealandSavingContribution",
    LABEL: "Select if you are currently contributing to",
    OPTIONS: [
      { label: "KiwiSaver", name: "kiwiSaver" },
      { label: "AMP Workplace Savings Scheme", name: "workplaceSavingsScheme" }
    ]
  }
};
