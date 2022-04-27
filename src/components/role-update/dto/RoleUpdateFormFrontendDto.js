export default class RoleUpdateFormFrontendDto {
  // evaluation status
  evaluationStatus;
  // form status
  status;

  // current employee details section
  employee;

  // change type section
  changeApproved;
  effectiveDate;
  temporaryTermsChange;
  temporaryTermsEndDate;
  permanentChangeType;
  reasonForFixedTerm;
  fixedTermChangeType;
  fixedTermEndDate;
  fixedTermNewEndDate;
  thirdPartyChangeType;
  contractorCurrentEndDate;
  contractorNewEndDate;
  contractorAcknowledged;
  secondmentChangeType;
  secondmentEndDate;
  secondmentNewEndDate;
  casualChangeType;
  fixedTermProbationPeriod;
  parentalLeaveChangeType;

  // (new) position details
  positionDescriptionAttachment;
  directManager;
  newDirectManager;
  teamMemberLevel;
  positionTitle;
  function;
  segment;
  group;
  team;
  vertical;
  department;
  costCentreChangeRequired;
  costCentre;
  codeRequired;
  projectType;
  projectCostCentre;
  driversLicence;
  carAllowanceRequired;
  carAllowanceAmount;
  shiftWork;
  onCall;
  commentsOnPosition;
  updateArchieReportingLine;
  additionalComments;

  // agreement details
  locationChange;
  primaryOffice;
  relocationExpenses;
  commentsOnLocation;
  remoteWork;
  hoursChange;
  workingHoursOptions;
  numberOfHoursPerWeek;
  usualDays;
  commentsOnHours;
  salaryChange;
  baseSalary;
  totalSalary;
  casualHourlyRate;
  superannuation;
  commentsOnSalary;
  commission;
  changeOfCommission;
  onTargetEarnings;
  commissionPaymentFrequency;

  // finance details
  creditCard;
  creditLimit;
  approvalLimit;
  delegatedApprovalAuthority;
  financeAttachments;

  // IT details
  localAdmin;
  computerChange;
  computerHardware;
  phoneSystemChange;
  teamsDirectNumber;
  isGenesysRequired;
  genesysAgentGroup;
  genesysAccessBasedOn;
  isMobilePhoneRequired;
  isPortACurrentNumberRequired;
  currentPhoneNumber;
  currentServiceProvider;
  softwareChange;
  software;
  networkDrives;
  additionalItAccess;
  cancelReason;
  archieAccessBasedOn;
  reportingLineManager;
  countryAccess;
  thisEmployeeIsAManagerInArchie;
  commentOnArchie;
  archieAnalyticsAccessBasedOn;
  banklinkAccessBasedOn;
  banklinkAccessRequired;
  otherSoftware;
  zendeskInstance;
  zendeskQueue;
  teamviewerLicenseType;
  tableauAccessType;
  commentsOnIT;
  salesforceProvision;

  static create(data) {
    const dto = new RoleUpdateFormFrontendDto();

    // status
    dto.evaluationStatus = data?.evaluationStatus;
    dto.status = data?.status;

    // current employee details section
    dto.employee = data?.employee;

    // change type section
    dto.changeApproved = data?.formContent?.changeApproved;
    dto.effectiveDate = data?.formContent?.effectiveDate;
    dto.temporaryTermsChange = data?.formContent?.temporaryTermsChange;
    dto.temporaryTermsEndDate = data?.formContent?.temporaryTermsEndDate;
    dto.permanentChangeType = data?.formContent?.permanentChangeType;
    dto.reasonForFixedTerm = data?.formContent?.reasonForFixedTerm;
    dto.fixedTermChangeType = data?.formContent?.fixedTermChangeType;
    dto.fixedTermNewEndDate = data?.formContent?.fixedTermNewEndDate;
    dto.fixedTermEndDate = data?.formContent?.fixedTermEndDate;
    dto.thirdPartyChangeType = data?.formContent?.thirdPartyChangeType;
    dto.contractorCurrentEndDate = data?.formContent?.contractorCurrentEndDate;
    dto.contractorNewEndDate = data?.formContent?.contractorNewEndDate;
    dto.contractorAcknowledged = data?.formContent?.contractorAcknowledged;
    dto.secondmentChangeType = data?.formContent?.secondmentChangeType;
    dto.secondmentEndDate = data?.formContent?.secondmentEndDate;
    dto.secondmentNewEndDate = data?.formContent?.secondmentNewEndDate;
    dto.casualChangeType = data?.formContent?.casualChangeType;
    dto.fixedTermProbationPeriod = data?.formContent?.fixedTermProbationPeriod;
    dto.parentalLeaveChangeType = data?.formContent?.parentalLeaveChangeType;

    // (new) position details
    dto.positionDescriptionAttachment =
      data?.formContent?.positionDescriptionAttachment;
    dto.directManager = data?.formContent?.directManager;
    dto.newDirectManager = data?.formContent?.newDirectManager;
    dto.teamMemberLevel = data?.formContent?.teamMemberLevel;
    dto.positionTitle = data?.formContent?.positionTitle;
    dto._positionTitle = data?.formContent?.positionTitle;
    dto.function = { function: data?.formContent?.function };
    dto.segment = { segment: data?.formContent?.segment };
    dto.group = { group: data?.formContent?.group };
    dto.team = { team: data?.formContent?.team };
    dto.vertical = { vertical: data?.formContent?.vertical };
    dto.department = { department: data?.formContent?.department };
    dto.costCentreChangeRequired = data?.formContent?.costCentreChangeRequired;
    dto.costCentre = { costCentre: data?.formContent?.costCentre };
    dto.codeRequired = data?.formContent?.codeRequired;
    dto.projectType = data?.formContent?.projectType;
    dto.projectCostCentre = {
      costCentre: data?.formContent?.projectCostCentre
    };
    dto.driversLicence = data?.formContent?.driversLicence;
    dto.carAllowanceRequired = data?.formContent?.carAllowanceRequired;
    dto.carAllowanceAmount = data?.formContent?.carAllowanceAmount;
    dto.shiftWork = data?.formContent?.shiftWork;
    dto.onCall = data?.formContent?.onCall;
    dto.commentsOnPosition = data?.formContent?.commentsOnPosition;
    dto.updateArchieReportingLine =
      data?.formContent?.updateArchieReportingLine;
    dto.additionalComments = data?.formContent?.additionalComments;

    // agreement details
    dto.locationChange = data?.formContent?.locationChange;
    dto.primaryOffice = data?.formContent?.primaryOffice;
    dto.relocationExpenses = data?.formContent?.relocationExpenses;
    dto.commentsOnLocation = data?.formContent?.commentsOnLocation;
    dto.remoteWork = data?.formContent?.remoteWork;
    dto.hoursChange = data?.formContent?.hoursChange;
    dto.workingHoursOptions = data?.formContent?.workingHoursOptions;
    dto.numberOfHoursPerWeek = data?.formContent?.numberOfHoursPerWeek;
    dto.usualDays = data?.formContent?.usualDays;
    dto.commentsOnHours = data?.formContent?.commentsOnHours;
    dto.salaryChange = data?.formContent?.salaryChange;
    dto.baseSalary = data?.formContent?.baseSalary;
    dto.totalSalary = data?.formContent?.totalSalary;
    dto.superannuation = data?.formContent?.superannuation;
    dto.commentsOnSalary = data?.formContent?.commentsOnSalary;
    dto.commission = data?.formContent?.commission;
    dto.onTargetEarnings = data?.formContent?.onTargetEarnings;
    dto.commissionPaymentFrequency =
      data?.formContent?.commissionPaymentFrequency;
    dto.changeOfCommission = data?.formContent?.changeOfCommission;
    dto.casualHourlyRate = data?.formContent?.casualHourlyRate;

    // finance details
    dto.creditCard = data?.formContent?.creditCard;
    dto.creditLimit = data?.formContent?.creditLimit;
    dto.approvalLimit = data?.formContent?.approvalLimit;
    dto.delegatedApprovalAuthority =
      data?.formContent?.delegatedApprovalAuthority;
    dto.financeAttachments = data?.formContent?.financeAttachments;

    // IT details
    dto.localAdmin = data?.formContent?.localAdmin;
    dto.computerChange = data?.formContent?.computerChange;
    dto.computerHardware = data?.formContent?.computerHardware;
    dto.phoneSystemChange = data?.formContent?.phoneSystemChange;
    dto.teamsDirectNumber = data?.formContent?.teamsDirectNumber;
    dto.isGenesysRequired = data?.formContent?.isGenesysRequired;
    dto.genesysAgentGroup = data?.formContent?.genesysAgentGroup;
    dto.genesysAccessBasedOn = data?.formContent?.genesysAccessBasedOn;
    dto.isMobilePhoneRequired = data?.formContent?.isMobilePhoneRequired;
    dto.isPortACurrentNumberRequired =
      data?.formContent?.isPortACurrentNumberRequired;
    dto.currentPhoneNumber = data?.formContent?.currentPhoneNumber;
    dto.currentServiceProvider = data?.formContent?.currentServiceProvider;
    dto.softwareChange = data?.formContent?.softwareChange;
    dto.software = data?.formContent?.software;
    dto.networkDrives = data?.formContent?.networkDrives;
    dto.additionalItAccess = data?.formContent?.additionalItAccess;
    dto.cancelReason = data?.formContent?.cancelReason;
    dto.archieAccessBasedOn = data?.formContent?.archieAccessBasedOn;
    dto.reportingLineManager = data?.formContent?.reportingLineManager;
    dto.countryAccess = data?.formContent?.countryAccess;
    dto.thisEmployeeIsAManagerInArchie =
      data?.formContent?.thisEmployeeIsAManagerInArchie;
    dto.commentOnArchie = data?.formContent?.commentOnArchie;
    dto.archieAnalyticsAccessBasedOn =
      data?.formContent?.archieAnalyticsAccessBasedOn;
    dto.banklinkAccessBasedOn = data?.formContent?.banklinkAccessBasedOn;
    dto.banklinkAccessRequired = data?.formContent?.banklinkAccessRequired;
    dto.otherSoftware = data?.formContent?.otherSoftware;
    dto.zendeskInstance = data?.formContent?.zendeskInstance;
    dto.zendeskQueue = data?.formContent?.zendeskQueue;
    dto.teamviewerLicenseType = data?.formContent?.teamviewerLicenseType;
    dto.tableauAccessType = data?.formContent?.tableauAccessType;
    dto.commentsOnIT = data?.formContent?.commentsOnIT;
    dto.salesforceProvision = data?.formContent?.salesforceProvision;
    return dto;
  }
}
