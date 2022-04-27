import UserFactory from "../../../factories/UserFactory";

export default class DepartureFormFrontendDto {
  employee;
  employeeid;

  positionTitle;
  function;
  group;
  department;
  team;
  vertical;
  location;

  departureReason;
  lastDayInTheOffice;
  lastDayOfEmployment;
  departureImpact;
  onsiteRepresentativeId;
  otherReason;

  static create(data) {
    const departureFormFrontendDto = new DepartureFormFrontendDto();

    departureFormFrontendDto.employee = UserFactory.create(data.employee);
    departureFormFrontendDto.employeeId = departureFormFrontendDto.employee.id;

    if (data.replacementManager) {
      departureFormFrontendDto.newManager = UserFactory.create(
        data.replacementManager
      );
      departureFormFrontendDto.replacementManagerId =
        data.replacementManager?.id;
    }

    departureFormFrontendDto.positionTitle = data.employee.positionTitle;
    departureFormFrontendDto.function = data.employee.function;
    departureFormFrontendDto.group = data.employee.group;
    departureFormFrontendDto.department = data.employee.department;
    departureFormFrontendDto.team = data.employee.team;
    departureFormFrontendDto.vertical = data.employee.vertical;
    departureFormFrontendDto.location = data.employee.locationOffice;

    departureFormFrontendDto.departureReason = data.formContent.departureReason;
    departureFormFrontendDto.lastDayInTheOffice =
      data.formContent.lastDayInTheOffice;
    departureFormFrontendDto.lastDayOfEmployment =
      data.formContent.lastDayOfEmployment;
    departureFormFrontendDto.departureImpact = data.formContent.departureImpact;
    departureFormFrontendDto.resignationLetter = data.formContent.attachments;
    departureFormFrontendDto.otherReason = data.formContent.otherReason;

    if (data.onsiteRepresentative) {
      departureFormFrontendDto.onsiteRepresentativeId =
        data.onsiteRepresentative.id;
      departureFormFrontendDto.collectorName = UserFactory.create(
        data.onsiteRepresentative
      );
    }

    if (data.replacementManager) {
      departureFormFrontendDto.replacementManagerId =
        data.replacementManager.id;
      departureFormFrontendDto.newManager = UserFactory.create(
        data.replacementManager
      );
    }

    return departureFormFrontendDto;
  }
}
