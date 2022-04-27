import React from "react";
import { EEFormTextArea } from "./form-fields";
import { commonMetaData } from "./commonMetaData";

export default function NetworkDrives() {
  return (
    <>
      <EEFormTextArea
        name={commonMetaData.networkDrives.NAME}
        label={commonMetaData.networkDrives.LABEL}
      ></EEFormTextArea>
    </>
  );
}
