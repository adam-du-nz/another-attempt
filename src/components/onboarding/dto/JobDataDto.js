/**
 * Represents data we have received from Cornerstone that is actually
 * useful for pre-populating the onboarding form.
 */
export default class JobDataDto {
  workingHours;
  firstName;
  lastName;
  email;
  phoneNumber;
  managerFullName;
  positionTitle;

  static create(data) {
    const jobDataDto = new JobDataDto();

    jobDataDto.workingHours = data.workingHours;
    jobDataDto.firstName = data.firstName;
    jobDataDto.lastName = data.lastName;
    jobDataDto.email = data.email;
    jobDataDto.phoneNumber = data.phoneNumber;
    jobDataDto.managerFullName = data.managerFullName;
    jobDataDto.positionTitle = data.positionTitle;

    return jobDataDto;
  }
}
