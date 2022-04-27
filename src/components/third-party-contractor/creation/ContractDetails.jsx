import React from "react";
import { useFormContext } from "react-hook-form";
import {
  EEFormSearch,
  EEFormInput,
  EEFormRadioButtons,
  EEFormTextArea
} from "../../common/form-fields";
import { Input } from "@myob/myob-widgets";
import { thirdPartyContractorFormMetaData } from "./thirdPartyContractorFormMetaData";

export default function ContractDetails({ employees }) {
  const { getValues } = useFormContext();
  const metaData = [
    { columnName: "fullNameUppercase", columnWidth: "150px", showData: true },
    { columnName: "userPrincipalName", columnWidth: "243px", align: "right" }
  ];

  return (
    <>
      <EEFormSearch
        name={thirdPartyContractorFormMetaData.contractDetails.managerName.NAME}
        label={
          thirdPartyContractorFormMetaData.contractDetails.managerName.LABEL
        }
        items={employees}
        metaData={metaData}
      />
      <Input
        name={
          thirdPartyContractorFormMetaData.contractDetails.managerEmail.NAME
        }
        label={
          thirdPartyContractorFormMetaData.contractDetails.managerEmail.LABEL
        }
        value={getValues().managerName?.["email"]}
        disabled={true}
      />
      <EEFormRadioButtons
        name={
          thirdPartyContractorFormMetaData.contractDetails
            .independentContractorQuestionnaire.NAME
        }
        label={
          thirdPartyContractorFormMetaData.contractDetails
            .independentContractorQuestionnaire.LABEL
        }
        options={
          thirdPartyContractorFormMetaData.contractDetails
            .independentContractorQuestionnaire.OPTIONS
        }
      />
      <EEFormRadioButtons
        name={
          thirdPartyContractorFormMetaData.contractDetails
            .hasCurrentConsultancyAgreement.NAME
        }
        label={
          thirdPartyContractorFormMetaData.contractDetails
            .hasCurrentConsultancyAgreement.LABEL
        }
        options={
          thirdPartyContractorFormMetaData.contractDetails
            .hasCurrentConsultancyAgreement.OPTIONS
        }
      />
      <EEFormInput
        name={thirdPartyContractorFormMetaData.contractDetails.companyName.NAME}
        label={
          thirdPartyContractorFormMetaData.contractDetails.companyName.LABEL
        }
      />
      <EEFormTextArea
        name={
          thirdPartyContractorFormMetaData.contractDetails.companyAddress.NAME
        }
        label={
          thirdPartyContractorFormMetaData.contractDetails.companyAddress.LABEL
        }
      />
      <EEFormInput
        name={
          thirdPartyContractorFormMetaData.contractDetails.companyTaxNumber.NAME
        }
        label={
          thirdPartyContractorFormMetaData.contractDetails.companyTaxNumber
            .LABEL
        }
      />
    </>
  );
}
