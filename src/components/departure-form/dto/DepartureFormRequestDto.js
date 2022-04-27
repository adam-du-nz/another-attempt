export default class DepartureFormRequestDto {
  attachments;
  employeeId;
  departureReason;
  lastDayInTheOffice;
  lastDayOfEmployment;
  departureImpact;
  replacementManagerId;
  onsiteRepresentativeId;
  otherReason;

  static common(data) {
    const departureFormRequestDto = new DepartureFormRequestDto();

    const ignoreDepartureImpact = new Set([
      "End of contract (fixed-term, casual or 3rd party)",
      "Did not start",
      "Deceased"
    ]);

    departureFormRequestDto.departureReason = data.departureReason;
    departureFormRequestDto.lastDayInTheOffice = data.lastDayInTheOffice;
    departureFormRequestDto.lastDayOfEmployment = data.lastDayOfEmployment;
    departureFormRequestDto.departureImpact = !(
      data.departureReason in ignoreDepartureImpact
    )
      ? data.departureImpact
      : null;
    departureFormRequestDto.replacementManagerId =
      data.hasDirectReports && data.replacementManagerId
        ? data.replacementManagerId
        : null;
    departureFormRequestDto.onsiteRepresentativeId =
      data.departureReason !== "Did not start" && data.onsiteRepresentativeId
        ? data.onsiteRepresentativeId
        : null;
    departureFormRequestDto.attachments = data.resignationLetter;
    departureFormRequestDto.otherReason = data.otherReason;

    return departureFormRequestDto;
  }

  static create(data) {
    const departureFormRequestDto = this.common(data);

    departureFormRequestDto.employeeId = data.employeeId;

    return departureFormRequestDto;
  }

  static createEdit(data) {
    return this.common(data);
  }
}
