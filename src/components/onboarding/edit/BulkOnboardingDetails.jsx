import React from "react";
import { FormHorizontal } from "@myob/myob-widgets";
import { onboardingFormMetaData } from "../common/onboardingFormMetaData";
import {
  EEFormCheckbox,
  EEFormDatePicker,
  EEFormInput
} from "../../common/form-fields";

const BulkOnboardingDetails = () => {
  return (
    <FormHorizontal>
      <EEFormCheckbox
        name={onboardingFormMetaData.bulkOnboardingDetails.isAcquisition.NAME}
        label={onboardingFormMetaData.bulkOnboardingDetails.isAcquisition.LABEL}
        options={
          onboardingFormMetaData.bulkOnboardingDetails.isAcquisition.OPTIONS
        }
      />
      <EEFormInput
        name={onboardingFormMetaData.bulkOnboardingDetails.companyName.NAME}
        label={onboardingFormMetaData.bulkOnboardingDetails.companyName.LABEL}
      />
      <EEFormDatePicker
        name={
          onboardingFormMetaData.bulkOnboardingDetails.originalStartDate.NAME
        }
        label={
          onboardingFormMetaData.bulkOnboardingDetails.originalStartDate.LABEL
        }
      />
      <EEFormDatePicker
        name={
          onboardingFormMetaData.bulkOnboardingDetails.acquisitionDate.NAME
        }
        label={
          onboardingFormMetaData.bulkOnboardingDetails.acquisitionDate.LABEL
        }
      />
    </FormHorizontal>
  );
};

export default BulkOnboardingDetails;
