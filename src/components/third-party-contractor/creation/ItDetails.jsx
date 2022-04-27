import React from "react";
import { EEFormRadioButtons, EEFormTextArea } from "../../common/form-fields";
import FormAlert from "../../common/FormAlert";
import { useFormContext } from "react-hook-form";
import { isIncluded } from "../../../utils";
import { thirdPartyContractorFormMetaData } from "./thirdPartyContractorFormMetaData";
import LocalAdminAccess from "../../common/LocalAdminAccess";
import Software from "../../common/Software";
import ComputerHardware from "../../common/ComputerHardware";
import MobilePhone from "../../common/MobilePhone";
import NetworkDrives from "../../common/NetworkDrives";
import PhoneSystems from "../../common/PhoneSystems";

export default function ItDetails({ employees }) {
  const { getValues } = useFormContext();

  const autoProvisionedSoftwareList = `By default all new users will have access to:
  - Microsoft Office 365
  - HelpMe Employee Support Portal
  - Teams and Slack
  - Confluence
  - Bridge
  `;
  return (
    <>
      <EEFormRadioButtons
        name={thirdPartyContractorFormMetaData.itDetails.hasOwnHardware.NAME}
        label={thirdPartyContractorFormMetaData.itDetails.hasOwnHardware.LABEL}
        options={
          thirdPartyContractorFormMetaData.itDetails.hasOwnHardware.OPTIONS
        }
      />
      {isIncluded(
        getValues(
          thirdPartyContractorFormMetaData.itDetails.hasOwnHardware.NAME
        ),
        thirdPartyContractorFormMetaData.itDetails.hasOwnHardware.OPTIONS[1]
      ) && (
        <>
          <LocalAdminAccess />
          <ComputerHardware />
        </>
      )}

      <EEFormRadioButtons
        name={
          thirdPartyContractorFormMetaData.itDetails.isNetworkAccessRequired
            .NAME
        }
        label={
          thirdPartyContractorFormMetaData.itDetails.isNetworkAccessRequired
            .LABEL
        }
        options={
          thirdPartyContractorFormMetaData.itDetails.isNetworkAccessRequired
            .OPTIONS
        }
      />
      {isIncluded(
        getValues(
          thirdPartyContractorFormMetaData.itDetails.isNetworkAccessRequired
            .NAME
        ),
        thirdPartyContractorFormMetaData.itDetails.isNetworkAccessRequired
          .OPTIONS[0]
      ) && (
        <div id="system-access-set-up">
          <PhoneSystems employees={employees} />
          <MobilePhone />
          <FormAlert
            alertMessage={autoProvisionedSoftwareList}
            alertType="info"
          ></FormAlert>
          <Software employees={employees} />
          <EEFormTextArea
            name={
              thirdPartyContractorFormMetaData.itDetails.emailDistributionGroups
                .NAME
            }
            label={
              thirdPartyContractorFormMetaData.itDetails.emailDistributionGroups
                .LABEL
            }
            placeholder={
              thirdPartyContractorFormMetaData.itDetails.emailDistributionGroups
                .PLACEHOLDER
            }
          />
          <NetworkDrives />
          <FormAlert
            alertMessage={"Access to drives is not automatic."}
            alertType={"info"}
          />
        </div>
      )}

      <EEFormRadioButtons
        name={
          thirdPartyContractorFormMetaData.itDetails
            .isAgentIdForPhoneQueueRequired.NAME
        }
        label={
          thirdPartyContractorFormMetaData.itDetails
            .isAgentIdForPhoneQueueRequired.LABEL
        }
        options={
          thirdPartyContractorFormMetaData.itDetails
            .isAgentIdForPhoneQueueRequired.OPTIONS
        }
      />
    </>
  );
}
