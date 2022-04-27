import React from "react";
import FormAlert from "./FormAlert";
import { EEFormCheckbox } from "./form-fields";
import { commonMetaData } from "./commonMetaData";

export default function LocalAdminAccess() {
  return (
    <>
      <FormAlert
        alertMessage="Only specific roles are eligible for Local Admin. For full information, please read [here](https://helpme.myob.com/hc/en-us/articles/115008888747)."
        alertType="info"
      ></FormAlert>
      <EEFormCheckbox
        name={commonMetaData.localAdmin.NAME}
        label={commonMetaData.localAdmin.LABEL}
        options={commonMetaData.localAdmin.OPTIONS}
      ></EEFormCheckbox>
    </>
  );
}
