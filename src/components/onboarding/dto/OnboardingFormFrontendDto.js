export default class OnboardingFormFrontendDto {
  // employee details
  legalFirstName;
  preferredFirstName;
  surname;
  email;
  isLivingInNZ;
  phoneNumber;
  tShirtSize;
  workingRightsOptions;
  employmentTypeOptions;
  fixedTermReason;
  firstDayContact;
  startDate;
  startTime;
  endDate;

  // position details
  positionTitle;
  teamMemberLevel;
  positionDescriptionAttachment;
  casualProjectDescription;
  directManager;
  function;
  segment;
  group;
  team;
  vertical;
  department;
  costCentre;
  codeRequired;
  projectType;
  projectCostCentre;
  driversLicence;
  shiftWork;
  onCall;
  commentsOnPosition;

  // agreement details
  primaryOffice;
  relocationExpenses;
  remoteWork;
  workingHoursOptions;
  numberOfHoursPerWeek;
  usualDays;
  baseSalary;
  totalSalary;
  superannuation;
  casualHourlyRate;
  commission;
  onTargetEarnings;
  commissionPaymentFrequency;
  commentsOnAgreement;

  // finance details
  creditCard;
  creditLimit;
  approvalLimit;
  delegatedApprovalAuthority;
  financeAttachments;

  // IT details
  localAdmin;
  teamsDirectNumber;
  software;
  networkDrives;
  sharedMailbox;
  computerHardware;
  additionalItAccess;
  cancelReason;
  isGenesysRequired;
  genesysAgentGroup;
  isMobilePhoneRequired;
  isPortACurrentNumberRequired;
  currentPhoneNumber;
  currentServiceProvider;
  archieAccessBasedOn;
  reportingLineManager;
  countryAccess;
  thisEmployeeIsAManagerInArchie;
  commentOnArchie;
  archieAnalyticsAccessBasedOn;
  banklinkAccessBasedOn;
  banklinkAccessRequired;
  // genesysAccessBasedOn;
  otherSoftware;
  zendeskInstance;
  zendeskQueue;
  teamviewerLicenseType;
  tableauAccessType;

  // ES section
  probationPeriod;
  ebpPercentage;
  sendEBP;
  awaitingVisa;

  // AOP
  isAcquisition;
  companyName;
  originalStartDate;
  acquisitionDate;

  static create(data) {
    const dto = new OnboardingFormFrontendDto();
    dto.additionalItAccess = data.formContent.additionalItAccess;
    dto.approvalLimit = data.formContent.approvalLimit;
    dto.archieAccessBasedOn = data.formContent.archieAccessBasedOn;
    dto.archieAnalyticsAccessBasedOn =
      data.formContent.archieAnalyticsAccessBasedOn;
    dto.awaitingVisa = data.formContent.awaitingVisa;
    dto.banklinkAccessBasedOn = data.formContent.banklinkAccessBasedOn;
    dto.banklinkAccessRequired = data.formContent.banklinkAccessRequired;
    dto.genesysAccessBasedOn = data.formContent.genesysAccessBasedOn;
    dto.baseSalary = data.formContent.baseSalary;
    dto.casualHourlyRate = data.formContent.casualHourlyRate;
    dto.casualProjectDescription = data.formContent.casualProjectDescription;
    dto.codeRequired = data.formContent.codeRequired;
    dto.commentsOnAgreement = data.formContent.commentsOnAgreement;
    dto.commentOnArchie = data.formContent.commentOnArchie;
    dto.commentsOnPosition = data.formContent.commentsOnPosition;
    dto.commission = data.formContent.commission;
    dto.commissionPaymentFrequency =
      data.formContent.commissionPaymentFrequency;
    dto.computerHardware = data.formContent.computerHardware;
    dto.costCentre = { costCentre: data.formContent.costCentre };
    dto.countryAccess = data.formContent.countryAccess;
    dto.creditCard = data.formContent.creditCard;
    dto.creditLimit = data.formContent.creditLimit;
    dto.currentPhoneNumber = data.formContent.currentPhoneNumber;
    dto.currentServiceProvider = data.formContent.currentServiceProvider;
    dto.delegatedApprovalAuthority =
      data.formContent.delegatedApprovalAuthority;
    dto.department = { department: data.formContent.department };
    dto.directManager = data.formContent.directManager;
    dto.driversLicence = data.formContent.driversLicence;
    dto.ebpPercentage = data.formContent.ebpPercentage;
    dto.email = data.formContent.email;
    dto.employmentTypeOptions = data.formContent.employmentTypeOptions;
    dto.endDate = data.formContent.endDate;
    dto.financeAttachments = data.formContent.financeAttachments;
    dto.firstDayContact = data.formContent.firstDayContact;
    dto.fixedTermReason = data.formContent.fixedTermReason;
    dto.function = { function: data.formContent.function };
    dto.genesysAgentGroup = data.formContent.genesysAgentGroup;
    dto.group = { group: data.formContent.group };
    dto.isGenesysRequired = data.formContent.isGenesysRequired;
    dto.isLivingInNZ = data.formContent.isLivingInNZ;
    dto.isMobilePhoneRequired = data.formContent.isMobilePhoneRequired;
    dto.isPortACurrentNumberRequired =
      data.formContent.isPortACurrentNumberRequired;
    dto.legalFirstName = data.formContent.legalFirstName;
    dto.localAdmin = data.formContent.localAdmin;
    dto.networkDrives = data.formContent.networkDrives;
    dto.numberOfHoursPerWeek = data.formContent.numberOfHoursPerWeek;
    dto.onCall = data.formContent.onCall;
    dto.onTargetEarnings = data.formContent.onTargetEarnings;
    dto.otherSoftware = data.formContent.otherSoftware;
    dto.phoneNumber = data.formContent.phoneNumber;
    dto.positionDescriptionAttachment =
      data.formContent.positionDescriptionAttachment;
    dto.positionTitle = data.formContent.positionTitle;
    dto._positionTitle = data.formContent.positionTitle;
    dto.preferredFirstName = data.formContent.preferredFirstName;
    dto.primaryOffice = data.formContent.primaryOffice;
    dto.probationPeriod = data.formContent.probationPeriod;
    dto.projectCostCentre = { costCentre: data.formContent.projectCostCentre };
    dto.projectType = data.formContent.projectType;
    dto.relocationExpenses = data.formContent.relocationExpenses;
    dto.remoteWork = data.formContent.remoteWork;
    dto.reportingLineManager = data.formContent.reportingLineManager;
    dto.segment = { segment: data.formContent.segment };
    dto.sendEBP = data.formContent.sendEBP;
    dto.sharedMailbox = data.formContent.sharedMailbox;
    dto.shiftWork = data.formContent.shiftWork;
    dto.teamsDirectNumber = data.formContent.teamsDirectNumber;
    dto.software = data.formContent.software;
    dto.startDate = data.formContent.startDate;
    dto.startTime = data.formContent.startTime;
    dto.superannuation = data.formContent.superannuation;
    dto.surname = data.formContent.surname;
    dto.team = { team: data.formContent.team };
    dto.teamMemberLevel = data.formContent.teamMemberLevel;
    dto.thisEmployeeIsAManagerInArchie =
      data.formContent.thisEmployeeIsAManagerInArchie;
    dto.totalSalary = data.formContent.totalSalary;
    dto.tShirtSize = data.formContent.tShirtSize;
    dto.usualDays = data.formContent.usualDays;
    dto.vertical = { vertical: data.formContent.vertical };
    dto.workingHoursOptions = data.formContent.workingHoursOptions;
    dto.workingRightsOptions = data.formContent.workingRightsOptions;
    dto.zendeskInstance = data.formContent.zendeskInstance;
    dto.zendeskQueue = data.formContent.zendeskQueue;
    dto.salesforceProvision = data.formContent.salesforceProvision;
    dto.teamviewerLicenseType = data.formContent.teamviewerLicenseType;
    dto.tableauAccessType = data.formContent.tableauAccessType;
    dto.cancelReason = data.additionalData?.cancelReason;
    dto.isAcquisition = data.formContent.isAcquisition;
    dto.companyName = data.formContent.companyName;
    dto.originalStartDate = data.formContent.originalStartDate;
    dto.acquisitionDate = data.formContent.acquisitionDate;
    return dto;
  }
}
