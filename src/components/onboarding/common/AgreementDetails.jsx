import React, { useEffect } from "react";
import {
  EEFormRadioButtons,
  EEFormInput,
  EEFormTextArea
} from "../../common/form-fields";
import { DollarIcon } from "@myob/myob-widgets";
import Location from "../../common/Location";
import Commission from "../../common/Commission";
import { onboardingFormMetaData } from "./onboardingFormMetaData";
import { useFormContext } from "react-hook-form";
import { isNil } from "ramda";
import { isNumeric, isIncluded } from "../../../utils";
import { commonMetaData } from "../../common/commonMetaData";

const AgreementDetails = ({ jobData }) => {
  const { getValues, setValue } = useFormContext();

  // Calculate Australian superannuation from base salary
  const AUSTRALIAN_SUPER_RATE = 0.1;
  const baseSalaryValue = getValues(
    onboardingFormMetaData.agreementDetails.baseSalary.NAME
  );
  useEffect(() => {
    const listenOnBaseSalaryValue = () => {
      if (isNumeric(baseSalaryValue)) {
        const superannuationValue = Math.round(
          baseSalaryValue * AUSTRALIAN_SUPER_RATE
        );
        const totalSalaryValue =
          parseInt(baseSalaryValue) + parseInt(superannuationValue);
        setValue(
          onboardingFormMetaData.agreementDetails.superannuation.NAME,
          superannuationValue,
          { shouldValidate: true }
        );
        setValue(
          onboardingFormMetaData.agreementDetails.totalSalary.NAME,
          totalSalaryValue,
          { shouldValidate: true }
        );
      }
      if (baseSalaryValue === "" || isNil(baseSalaryValue)) {
        setValue(
          onboardingFormMetaData.agreementDetails.superannuation.NAME,
          null,
          { shouldValidate: true }
        );
        setValue(
          onboardingFormMetaData.agreementDetails.totalSalary.NAME,
          null,
          { shouldValidate: true }
        );
      }
    };
    listenOnBaseSalaryValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseSalaryValue]);

  // Translates data from Cornerstone job req into correct form value
  const workingHoursOptions =
    onboardingFormMetaData.agreementDetails.workingHoursOptions.NAME;
  useEffect(() => {
    if (!isNil(jobData)) {
      if (jobData.workingHours === "Full Time") {
        const value =
          onboardingFormMetaData.agreementDetails.workingHoursOptions
            .OPTIONS[0];
        setValue(workingHoursOptions, value);
      } else if (jobData.workingHours === "Part Time") {
        const value =
          onboardingFormMetaData.agreementDetails.workingHoursOptions
            .OPTIONS[1];
        setValue(workingHoursOptions, value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobData]);

  const employmentType =
    onboardingFormMetaData.employeeDetails.employmentTypeOptions.NAME;
  const casual =
    onboardingFormMetaData.employeeDetails.employmentTypeOptions.OPTIONS[2]
      .label;
  const partTime =
    onboardingFormMetaData.agreementDetails.workingHoursOptions.OPTIONS[1];

  return (
    <>
      <Location />
      {getValues(employmentType) !== casual && (
        <EEFormRadioButtons
          name={
            onboardingFormMetaData.agreementDetails.workingHoursOptions.NAME
          }
          label={
            onboardingFormMetaData.agreementDetails.workingHoursOptions.LABEL
          }
          options={
            onboardingFormMetaData.agreementDetails.workingHoursOptions.OPTIONS
          }
        ></EEFormRadioButtons>
      )}
      {getValues(workingHoursOptions) === partTime &&
        getValues(employmentType) !== casual && (
          <>
            <EEFormInput
              name={
                onboardingFormMetaData.agreementDetails.numberOfHoursPerWeek
                  .NAME
              }
              label={
                onboardingFormMetaData.agreementDetails.numberOfHoursPerWeek
                  .LABEL
              }
              placeholder={
                onboardingFormMetaData.agreementDetails.numberOfHoursPerWeek
                  .PLACEHOLDER
              }
              type="number"
            ></EEFormInput>
            <EEFormInput
              name={onboardingFormMetaData.agreementDetails.usualDays.NAME}
              label={onboardingFormMetaData.agreementDetails.usualDays.LABEL}
              type="text"
            ></EEFormInput>
          </>
        )}
      {getValues(employmentType) !== casual && (
        <EEFormInput
          name={onboardingFormMetaData.agreementDetails.baseSalary.NAME}
          label={onboardingFormMetaData.agreementDetails.baseSalary.LABEL}
          placeholder={
            onboardingFormMetaData.agreementDetails.baseSalary.PLACEHOLDER
          }
          type="number"
          prefixIcon={<DollarIcon />}
        ></EEFormInput>
      )}
      {getValues(employmentType) !== casual &&
        isIncluded(
          String(getValues(commonMetaData.primaryOffice.NAME)).match(/AU - /g),
          "AU - "
        ) && (
          <>
            <EEFormInput
              name={onboardingFormMetaData.agreementDetails.superannuation.NAME}
              label={
                onboardingFormMetaData.agreementDetails.superannuation.LABEL
              }
              type="number"
              prefixIcon={<DollarIcon />}
              disabled
            ></EEFormInput>
            <EEFormInput
              name={onboardingFormMetaData.agreementDetails.totalSalary.NAME}
              label={onboardingFormMetaData.agreementDetails.totalSalary.LABEL}
              type="number"
              prefixIcon={<DollarIcon />}
              disabled
            ></EEFormInput>
          </>
        )}
      {getValues(employmentType) === casual && (
        <EEFormInput
          name={onboardingFormMetaData.agreementDetails.casualHourlyRate.NAME}
          label={onboardingFormMetaData.agreementDetails.casualHourlyRate.LABEL}
          type="number"
          prefixIcon={<DollarIcon />}
        ></EEFormInput>
      )}
      <Commission />
      <EEFormTextArea
        name={onboardingFormMetaData.agreementDetails.commentsOnAgreement.NAME}
        label={
          onboardingFormMetaData.agreementDetails.commentsOnAgreement.LABEL
        }
      ></EEFormTextArea>
    </>
  );
};

export default AgreementDetails;
