import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { isNil } from "ramda";

import {
  EEFormSearch,
  EEFormCheckbox,
  EEFormTextArea,
  EEFormFileInput
} from "../../common/form-fields";
import { commonMetaData } from "../../common/commonMetaData";
import { onboardingFormMetaData } from "./onboardingFormMetaData";
import PositionCostCentreDetails from "./PositionCostCentreDetails";
import PositionOrganisationDetails from "./PositionOrganisationDetails";
import PositionTitle from "../../common/PositionTitle";
import TeamMemberLevel from "../../common/TeamMemberLevel";
import { isNotNilEmpty } from "../../../utils";
import sanitizeHTML from "sanitize-html";

const PositionDetails = ({ formData }) => {
  const employees = formData.employees;
  const jobData = formData.jobData;

  const addNewPosition = value => {
    if (isNotNilEmpty(value)) {
      const sanitisedValue = sanitizeHTML(value);
      setValue(`_${commonMetaData.positionTitle.NAME}`, sanitisedValue, {
        shouldDirty: true
      });
    }
  };

  const { getValues, setValue } = useFormContext();
  useEffect(() => {
    if (!isNil(jobData)) {
      const manager = employees.find(
        man => man.fullName === jobData.managerFullName
      );
      setValue(commonMetaData.directManager.NAME, manager);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobData]);

  const employmentType =
    onboardingFormMetaData.employeeDetails.employmentTypeOptions.NAME;
  const casual =
    onboardingFormMetaData.employeeDetails.employmentTypeOptions.OPTIONS[2]
      .label;

  return (
    <>
      <TeamMemberLevel />
      <PositionTitle
        jobData={jobData}
        addNewPositionFn={addNewPosition}
      ></PositionTitle>
      {getValues(employmentType) !== casual && (
        <EEFormFileInput
          name={"positionDescriptionAttachment"}
          label={"Position Description"}
        />
      )}
      {getValues(employmentType) === casual && (
        <EEFormTextArea
          name={
            onboardingFormMetaData.positionDetails.casualProjectDescription.NAME
          }
          label={
            onboardingFormMetaData.positionDetails.casualProjectDescription
              .LABEL
          }
        ></EEFormTextArea>
      )}
      <EEFormSearch
        name={commonMetaData.directManager.NAME}
        label={commonMetaData.directManager.LABEL}
        items={employees}
        metaData={[
          {
            columnName: "fullName",
            columnWidth: "150px",
            showData: true
          },
          {
            columnName: "userPrincipalName",
            columnWidth: "243px",
            align: "right"
          }
        ]}
        hintText={"Select a manager"}
      ></EEFormSearch>
      <PositionOrganisationDetails
        managerField={commonMetaData.directManager.NAME}
      ></PositionOrganisationDetails>
      <PositionCostCentreDetails></PositionCostCentreDetails>
      <EEFormCheckbox
        name={onboardingFormMetaData.positionDetails.driversLicence.NAME}
        label={onboardingFormMetaData.positionDetails.driversLicence.LABEL}
        options={onboardingFormMetaData.positionDetails.driversLicence.OPTIONS}
      ></EEFormCheckbox>
      <EEFormCheckbox
        name={onboardingFormMetaData.positionDetails.onCall.NAME}
        label={onboardingFormMetaData.positionDetails.onCall.LABEL}
        options={onboardingFormMetaData.positionDetails.onCall.OPTIONS}
      ></EEFormCheckbox>
      <EEFormCheckbox
        name={onboardingFormMetaData.positionDetails.shiftWork.NAME}
        label={onboardingFormMetaData.positionDetails.shiftWork.LABEL}
        options={onboardingFormMetaData.positionDetails.shiftWork.OPTIONS}
      ></EEFormCheckbox>
      <EEFormTextArea
        name={onboardingFormMetaData.positionDetails.commentsOnPosition.NAME}
        label={onboardingFormMetaData.positionDetails.commentsOnPosition.LABEL}
      ></EEFormTextArea>
    </>
  );
};

export default PositionDetails;
