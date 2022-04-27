import React from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import HttpStatus from "http-status-codes";
import Card from "../../common/Card";
import { sanitiseFormData } from "../../../utils";
import { submitThirdPartyContractorForm } from "../../../apis/kilnBackendApis";
import { Button, ButtonRow, FormHorizontal } from "@myob/myob-widgets";
import AttachDocuments from "./AttachDocuments";
import ContractDetails from "./ContractDetails";
import ContractorDetails from "./ContractorDetails";
import ContractorPositionDetails from "./ContractorPositionDetails";
import FinalComments from "./FinalComments";
import ItDetails from "./ItDetails";
import ThirdPartyContractorPageTitle from "./ThirdPartyContractorPageTitle";
import { thirdPartyContractorFormMetaData } from "./thirdPartyContractorFormMetaData";
import { thirdPartyContractorFormSchema } from "./thirdPartyContractorFormSchema";
import { commonMetaData } from "../../common/commonMetaData";

export default function ThirdPartyContractorFormCreate({ employees }) {
  const history = useNavigate();
  const form = useForm({
    resolver: yupResolver(thirdPartyContractorFormSchema),
    mode: "all",
    defaultValues: {
      teamviewerLicenseType:
        "TeamViewer Lite - Up to 19 connections per month ($1000)",
      tableauAccessType: "Viewer"
    },
    shouldUnregister: true
  });
  form.watch([
    // listening on the change of value
    thirdPartyContractorFormMetaData.contractDetails.managerName.NAME,
    thirdPartyContractorFormMetaData.contractDetails
      .hasCurrentConsultancyAgreement.NAME,
    thirdPartyContractorFormMetaData.positionDetails.startDate.NAME,
    thirdPartyContractorFormMetaData.positionDetails.endDate.NAME,
    thirdPartyContractorFormMetaData.positionDetails.location.NAME,
    thirdPartyContractorFormMetaData.itDetails.hasOwnHardware.NAME,
    thirdPartyContractorFormMetaData.itDetails.isNetworkAccessRequired.NAME,
    commonMetaData.positionTitle.NAME,
    `_${commonMetaData.positionTitle.NAME}`
  ]);

  const onSubmit = async data => {
    const formattedData = sanitiseFormData(data);
    try {
      const response = await submitThirdPartyContractorForm(formattedData);
      if (response.status === HttpStatus.CREATED) {
        history("/success", {
          messages: [
            "Third party contractor form has been successfully submitted."
          ]
        });
        return;
      }
      if (response.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
        history("/error");
        return;
      }
      history("/error", { messages: [response.body.message] });
    } catch (err) {
      history("/error");
    }
  };

  return (
    <>
      <FormProvider {...form}>
        <FormHorizontal layout="primary">
          <form>
            <ThirdPartyContractorPageTitle />
            <Card
              title={"Contract Details"}
              body={<ContractDetails employees={employees} />}
            />
            <Card title={"Contractor Details"} body={<ContractorDetails />} />
            <Card
              title={"Contractor Position Details "}
              body={<ContractorPositionDetails />}
            />
            <Card
              title={"IT Details"}
              body={<ItDetails employees={employees} />}
            />
            <Card title={"Attach Documents"} body={<AttachDocuments />} />
            <Card title={"Final Comments"} body={<FinalComments />} />
            <ButtonRow>
              <Button tone="neutral" onClick={() => history(-1)}>
                Clear
              </Button>
              <Button tone="success" onClick={form.handleSubmit(onSubmit)}>
                Submit
              </Button>
            </ButtonRow>
          </form>
        </FormHorizontal>
      </FormProvider>
    </>
  );
}
