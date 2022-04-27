import React from "react";
import { LandlineIcon, MailIcon } from "@myob/myob-widgets";
import { EEFormInput } from "../../common/form-fields";
import FormAlert from "../../common/FormAlert";
import { thirdPartyContractorFormMetaData } from "./thirdPartyContractorFormMetaData";

export default function ContractorDetails() {
  return (
    <>
      <EEFormInput
        name={
          thirdPartyContractorFormMetaData.contractorDetails.preferredFirstName
            .NAME
        }
        label={
          thirdPartyContractorFormMetaData.contractorDetails.preferredFirstName
            .LABEL
        }
        type="text"
      />
      <EEFormInput
        name={thirdPartyContractorFormMetaData.contractorDetails.surname.NAME}
        label={thirdPartyContractorFormMetaData.contractorDetails.surname.LABEL}
        type="text"
      />
      <EEFormInput
        name={thirdPartyContractorFormMetaData.contractorDetails.email.NAME}
        label={thirdPartyContractorFormMetaData.contractorDetails.email.LABEL}
        type="email"
        prefixIcon={<MailIcon />}
      />
      <EEFormInput
        name={
          thirdPartyContractorFormMetaData.contractorDetails.mobileNumber.NAME
        }
        label={
          thirdPartyContractorFormMetaData.contractorDetails.mobileNumber.LABEL
        }
        placeholder={
          thirdPartyContractorFormMetaData.contractorDetails.mobileNumber
            .PLACEHOLDER
        }
        type="tel"
        prefixIcon={<LandlineIcon />}
      />
      <FormAlert
        alertMessage={"include country code: 61(AU), 64(NZ) e.g. 61 1234 56789"}
        alertType={"info"}
      />
    </>
  );
}
