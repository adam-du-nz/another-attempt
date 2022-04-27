import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LandlineIcon, MailIcon } from "@myob/myob-widgets";
import {
  EEFormInput,
  EEFormCheckbox,
  EEFormSearch,
  EEFormSelect,
  EEFormTimePicker,
  EEFormDatePicker,
  EEFormTextArea
} from "../../common/form-fields";
import FormAlert from "../../common/FormAlert";
import {
  todayDateFormatted,
  isWithinXAmountOfDaysInTheFuture,
  isLocationInPreviewMode
} from "../../../utils";
import { onboardingFormMetaData } from "./onboardingFormMetaData";
import { useFormContext } from "react-hook-form";
import { isNil } from "ramda";

export default function EmployeeDetails({ formData, onDateChangeFunc }) {
  const isPreviewMode = isLocationInPreviewMode(useLocation());
  const minDate = isPreviewMode ? null : todayDateFormatted();
  const employees = formData.employees;
  const jobData = formData.jobData;

  const { getValues, setValue } = useFormContext();
  useEffect(() => {
    if (!isNil(jobData)) {
      setValue(
        onboardingFormMetaData.employeeDetails.legalFirstName.NAME,
        jobData.firstName
      );
      setValue(
        onboardingFormMetaData.employeeDetails.preferredFirstName.NAME,
        jobData.firstName
      );
      setValue(
        onboardingFormMetaData.employeeDetails.surname.NAME,
        jobData.lastName
      );
      setValue(
        onboardingFormMetaData.employeeDetails.email.NAME,
        jobData.email
      );
      setValue(
        onboardingFormMetaData.employeeDetails.phoneNumber.NAME,
        jobData.phoneNumber
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobData]);

  const [
    startDateWithinSevenDaysNoticeMessage,
    setStartDateWithinSevenDaysNoticeMessage
  ] = useState(undefined);
  const startDate = getValues(
    onboardingFormMetaData.employeeDetails.startDate.NAME
  );
  useEffect(() => {
    const isStartDateWithinSevenDays = isWithinXAmountOfDaysInTheFuture(
      startDate,
      7
    );
    const noticeMessage =
      "To ensure a great onboarding experience for your new starter where everything they require is set up and ready to go, we do require at least 7 days’ notice.  Unfortunately any shorter timeframe can impact the onboarding experience.<br />The process to create accounts and procure a laptop for your new starter is triggered once the person has signed their contract. If your new starter is starting with less than 7 days’ notice, please ensure you raise a [HelpMe Ticket](https://helpme.myob.com/hc/en-us/requests/new?ticket_form_id=617288) to make the Employee Experience team aware. That way the team can do the very best to expedite the process.";
    isStartDateWithinSevenDays && !isPreviewMode
      ? setStartDateWithinSevenDaysNoticeMessage(noticeMessage)
      : setStartDateWithinSevenDaysNoticeMessage(undefined);
  }, [startDate, isPreviewMode]);

  const employmentType =
    onboardingFormMetaData.employeeDetails.employmentTypeOptions.NAME;
  const fixedTerm =
    onboardingFormMetaData.employeeDetails.employmentTypeOptions.OPTIONS[1]
      .label;

  const metaData = [
    { columnName: "fullNameUppercase", columnWidth: "150px", showData: true },
    { columnName: "userPrincipalName", columnWidth: "243px", align: "right" }
  ];

  return (
    <>
      <EEFormInput
        id={onboardingFormMetaData.employeeDetails.legalFirstName.NAME}
        name={onboardingFormMetaData.employeeDetails.legalFirstName.NAME}
        label={onboardingFormMetaData.employeeDetails.legalFirstName.LABEL}
        type="text"
      />
      <EEFormInput
        id={onboardingFormMetaData.employeeDetails.preferredFirstName.NAME}
        name={onboardingFormMetaData.employeeDetails.preferredFirstName.NAME}
        label={onboardingFormMetaData.employeeDetails.preferredFirstName.LABEL}
        type="text"
      />
      <EEFormInput
        id={onboardingFormMetaData.employeeDetails.surname.NAME}
        name={onboardingFormMetaData.employeeDetails.surname.NAME}
        label={onboardingFormMetaData.employeeDetails.surname.LABEL}
        type="text"
      />
      <EEFormInput
        id={onboardingFormMetaData.employeeDetails.email.NAME}
        name={onboardingFormMetaData.employeeDetails.email.NAME}
        label={onboardingFormMetaData.employeeDetails.email.LABEL}
        type="email"
        prefixIcon={<MailIcon />}
      />
      <EEFormCheckbox
        name={onboardingFormMetaData.employeeDetails.isNotLivingInAnz.NAME}
        label={onboardingFormMetaData.employeeDetails.isNotLivingInAnz.LABEL}
        options={
          onboardingFormMetaData.employeeDetails.isNotLivingInAnz.OPTIONS
        }
      />
      <EEFormInput
        id={onboardingFormMetaData.employeeDetails.phoneNumber.NAME}
        name={onboardingFormMetaData.employeeDetails.phoneNumber.NAME}
        label={onboardingFormMetaData.employeeDetails.phoneNumber.LABEL}
        placeholder={"Include country code: 61 for AU or 64 for NZ"}
        type="tel"
        prefixIcon={<LandlineIcon />}
      />
      <EEFormSearch
        name={onboardingFormMetaData.employeeDetails.firstDayContact.NAME}
        label={onboardingFormMetaData.employeeDetails.firstDayContact.LABEL}
        items={employees}
        metaData={metaData}
      />
      <EEFormSelect
        name={onboardingFormMetaData.employeeDetails.tShirtSize.NAME}
        label={onboardingFormMetaData.employeeDetails.tShirtSize.LABEL}
        options={onboardingFormMetaData.employeeDetails.tShirtSize.OPTIONS}
        placeholder={"Pick a T-shirt size"}
      ></EEFormSelect>
      <EEFormSelect
        name={onboardingFormMetaData.employeeDetails.workingRightsOptions.NAME}
        label={
          onboardingFormMetaData.employeeDetails.workingRightsOptions.LABEL
        }
        options={
          onboardingFormMetaData.employeeDetails.workingRightsOptions.OPTIONS
        }
        placeholder={"Select Working Rights"}
      ></EEFormSelect>
      <EEFormSelect
        name={onboardingFormMetaData.employeeDetails.employmentTypeOptions.NAME}
        label={
          onboardingFormMetaData.employeeDetails.employmentTypeOptions.LABEL
        }
        options={
          onboardingFormMetaData.employeeDetails.employmentTypeOptions.OPTIONS
        }
        placeholder={"Select Employment Type"}
      ></EEFormSelect>
      {getValues(employmentType) === fixedTerm && (
        <EEFormTextArea
          name={onboardingFormMetaData.employeeDetails.fixedTermReason.NAME}
          label={onboardingFormMetaData.employeeDetails.fixedTermReason.LABEL}
        ></EEFormTextArea>
      )}
      <EEFormDatePicker
        name={onboardingFormMetaData.employeeDetails.startDate.NAME}
        label={onboardingFormMetaData.employeeDetails.startDate.LABEL}
        min={minDate}
        onDateChange={onDateChangeFunc}
      ></EEFormDatePicker>
      {startDateWithinSevenDaysNoticeMessage && (
        <FormAlert
          alertType="warning"
          alertMessage={startDateWithinSevenDaysNoticeMessage}
        />
      )}
      <EEFormTimePicker
        name={onboardingFormMetaData.employeeDetails.startTime.NAME}
        label={onboardingFormMetaData.employeeDetails.startTime.LABEL}
      ></EEFormTimePicker>
      {getValues(employmentType) === fixedTerm && (
        <EEFormDatePicker
          name={onboardingFormMetaData.employeeDetails.endDate.NAME}
          label={onboardingFormMetaData.employeeDetails.endDate.LABEL}
          min={minDate}
          onDateChange={onDateChangeFunc}
        ></EEFormDatePicker>
      )}
    </>
  );
}
