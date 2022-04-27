import React from "react";
import { useFormContext } from "react-hook-form";
import { DollarIcon } from "@myob/myob-widgets";
import { roleUpdateMetaData } from "./roleUpdateMetaData";
import { commonMetaData } from "../../common/commonMetaData";
import {
  EEFormCheckbox,
  EEFormInput,
  EEFormSelect
} from "../../common/form-fields";
import { arrayExtractor } from "../../../utils";

export default function RoleUpdateCommission() {
  const { getValues } = useFormContext();

  return (
    <>
      <EEFormCheckbox
        name={roleUpdateMetaData.agreementDetails.commission.NAME}
        label={roleUpdateMetaData.agreementDetails.commission.LABEL}
        options={roleUpdateMetaData.agreementDetails.commission.OPTIONS}
      ></EEFormCheckbox>
      {arrayExtractor(
        getValues(roleUpdateMetaData.agreementDetails.commission.NAME)
      ) === roleUpdateMetaData.agreementDetails.commission.OPTIONS[0].name && (
        <>
          <EEFormSelect
            key={roleUpdateMetaData.agreementDetails.changeOfCommission.NAME}
            name={roleUpdateMetaData.agreementDetails.changeOfCommission.NAME}
            label={roleUpdateMetaData.agreementDetails.changeOfCommission.LABEL}
            options={
              roleUpdateMetaData.agreementDetails.changeOfCommission.OPTIONS
            }
            placeholder={
              roleUpdateMetaData.agreementDetails.changeOfCommission.PLACEHOLDER
            }
          ></EEFormSelect>
          {getValues(
            roleUpdateMetaData.agreementDetails.changeOfCommission.NAME
          ) ===
            roleUpdateMetaData.agreementDetails.changeOfCommission.OPTIONS[0]
              .label && (
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
                placeholder={
                  commonMetaData.commissionPaymentFrequency.PLACEHOLDER
                }
              ></EEFormSelect>
            </>
          )}
        </>
      )}
    </>
  );
}
