import React from "react";
import { DollarIcon } from "@myob/myob-widgets";
import { EEFormCheckbox, EEFormInput, EEFormSelect } from "./form-fields";
import { commonMetaData } from "./commonMetaData";
import { arrayExtractor } from "../../utils";
import { useFormContext } from "react-hook-form";

export default function Commission() {
  const { getValues } = useFormContext();

  return (
    <>
      <EEFormCheckbox
        name={commonMetaData.commission.NAME}
        label={commonMetaData.commission.LABEL}
        options={commonMetaData.commission.OPTIONS}
      ></EEFormCheckbox>
      {arrayExtractor(getValues(commonMetaData.commission.NAME)) ===
        commonMetaData.commission.OPTIONS[0].name && (
        <>
          <EEFormInput
            name={commonMetaData.onTargetEarnings.NAME}
            label={commonMetaData.onTargetEarnings.LABEL}
            type="number"
            prefixIcon={<DollarIcon />}
          ></EEFormInput>
          <EEFormSelect
            key={commonMetaData.commissionPaymentFrequency.NAME}
            name={commonMetaData.commissionPaymentFrequency.NAME}
            label={commonMetaData.commissionPaymentFrequency.LABEL}
            options={commonMetaData.commissionPaymentFrequency.OPTIONS}
            placeholder={commonMetaData.commissionPaymentFrequency.PLACEHOLDER}
          ></EEFormSelect>
        </>
      )}
    </>
  );
}
