import React from "react";
import EEFormTextArea from "../../common/form-fields/EEFormTextArea";
import { thirdPartyContractorFormMetaData } from "./thirdPartyContractorFormMetaData";

export default function FinalComments() {
  return (
    <>
      <EEFormTextArea
        name={thirdPartyContractorFormMetaData.finalComments.NAME}
        label={thirdPartyContractorFormMetaData.finalComments.LABEL}
      ></EEFormTextArea>
    </>
  );
}
