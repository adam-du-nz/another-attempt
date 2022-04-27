import React from "react";
import { useLocation } from "react-router-dom";
import { onboardingFormMetaData } from "./onboardingFormMetaData";
import { EEFormTextArea } from "../../common/form-fields";
import ComputerHardware from "../../common/ComputerHardware";
import FormAlert from "../../common/FormAlert";
import LocalAdminAccess from "../../common/LocalAdminAccess";
import MobilePhone from "../../common/MobilePhone";
import NetworkDrives from "../../common/NetworkDrives";
import PhoneSystems from "../../common/PhoneSystems";
import Software from "../../common/Software";
import { isLocationInPreviewMode } from "../../../utils";

export default function ItDetails(props) {
  const { employees } = props;
  const itDetailsPlaceholderText = isLocationInPreviewMode(useLocation())
    ? ""
    : onboardingFormMetaData.itDetails.additionalItAccess.PLACEHOLDER;

  const autoProvisionedSoftwareList = `By default all new users will have access to:
  - Microsoft Office 365
  - HelpMe Employee Support Portal
  - Teams and Slack
  - Confluence
  - Bridge
  `;

  return (
    <>
      <LocalAdminAccess />
      <ComputerHardware />
      <PhoneSystems employees={employees} />
      <MobilePhone />
      <NetworkDrives />
      <FormAlert
        alertMessage={autoProvisionedSoftwareList}
        alertType="info"
      ></FormAlert>
      <Software employees={employees} />
      <EEFormTextArea
        name={onboardingFormMetaData.itDetails.sharedMailbox.NAME}
        label={onboardingFormMetaData.itDetails.sharedMailbox.LABEL}
      ></EEFormTextArea>
      <EEFormTextArea
        name={onboardingFormMetaData.itDetails.additionalItAccess.NAME}
        label={onboardingFormMetaData.itDetails.additionalItAccess.LABEL}
        placeholder={itDetailsPlaceholderText}
      ></EEFormTextArea>
    </>
  );
}
