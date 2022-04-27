import React from "react";

import { EEFormCheckbox, EEFormSelect } from "./form-fields";
import { commonMetaData } from "./commonMetaData";

export default function Location() {
  return (
    <>
      <EEFormSelect
        key={commonMetaData.primaryOffice.NAME}
        name={commonMetaData.primaryOffice.NAME}
        label={commonMetaData.primaryOffice.LABEL}
        options={commonMetaData.primaryOffice.OPTIONS}
        placeholder="Please choose the primary office"
      ></EEFormSelect>
      <EEFormCheckbox
        name={commonMetaData.relocationExpenses.NAME}
        label={commonMetaData.relocationExpenses.LABEL}
        options={commonMetaData.relocationExpenses.OPTIONS}
      ></EEFormCheckbox>
      <EEFormCheckbox
        name={commonMetaData.remoteWork.NAME}
        label={commonMetaData.remoteWork.LABEL}
        options={commonMetaData.remoteWork.OPTIONS}
      ></EEFormCheckbox>
    </>
  );
}
