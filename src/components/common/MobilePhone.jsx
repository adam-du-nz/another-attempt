import React from "react";
import { LandlineIcon } from "@myob/myob-widgets";
import { useFormContext } from "react-hook-form";
import { EEFormCheckbox, EEFormInput } from "./form-fields";
import { commonMetaData } from "./commonMetaData";
import { isIncluded } from "../../utils";

export default function MobilePhone() {
  const { getValues } = useFormContext();

  return (
    <>
      <EEFormCheckbox
        name={commonMetaData.mobilePhone.isMobilePhoneRequired.NAME}
        label={commonMetaData.mobilePhone.isMobilePhoneRequired.LABEL}
        options={commonMetaData.mobilePhone.isMobilePhoneRequired.OPTIONS}
      ></EEFormCheckbox>
      {isIncluded(
        getValues(commonMetaData.mobilePhone.isMobilePhoneRequired.NAME),
        commonMetaData.mobilePhone.isMobilePhoneRequired.OPTIONS[0].name
      ) && (
        <>
          <EEFormCheckbox
            name={commonMetaData.mobilePhone.isPortACurrentNumberRequired.NAME}
            label={
              commonMetaData.mobilePhone.isPortACurrentNumberRequired.LABEL
            }
            options={
              commonMetaData.mobilePhone.isPortACurrentNumberRequired.OPTIONS
            }
          ></EEFormCheckbox>
          {isIncluded(
            getValues(
              commonMetaData.mobilePhone.isPortACurrentNumberRequired.NAME
            ),
            commonMetaData.mobilePhone.isPortACurrentNumberRequired.OPTIONS[0]
              .name
          ) && (
            <>
              <EEFormInput
                name={commonMetaData.mobilePhone.currentPhoneNumber.NAME}
                label={commonMetaData.mobilePhone.currentPhoneNumber.LABEL}
                type="tel"
                prefixIcon={<LandlineIcon />}
              ></EEFormInput>
              <EEFormInput
                name={commonMetaData.mobilePhone.currentServiceProvider.NAME}
                label={commonMetaData.mobilePhone.currentServiceProvider.LABEL}
              ></EEFormInput>
            </>
          )}
        </>
      )}
    </>
  );
}
