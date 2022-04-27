import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  ButtonRow,
  FormHorizontal,
  PageHead,
  PageState,
  Spinner
} from "@myob/myob-widgets";
import { isNil } from "ramda";
import React, { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import HttpStatus from "http-status-codes";
import UserContext from "../../../auth/UserContext";
import {
  submitOnboardingForm,
  getOnboardingFormByCornerstoneId
} from "../../../apis/kilnBackendApis";
import { isNotNilEmpty, sanitiseFormData } from "../../../utils/index.js";
import Card from "../../common/Card";
import { onboardingSchema } from "../common/onboardingSchema";
import AgreementDetails from "../common/AgreementDetails";
import EmployeeDetails from "../common/EmployeeDetails";
import FinanceDetails from "../../common/FinanceDetails";
import ItDetails from "../common/ItDetails";
import PositionDetails from "../common/PositionDetails";
import CardWithLoadingStatus from "../../common/CardWithLoadingStatus";
import JobDataDto from "../dto/JobDataDto";

const OnboardingCreate = ({ employees, jobReqId, applicantId }) => {
  const currentUser = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: yupResolver(onboardingSchema),
    mode: "all",
    defaultValues: {
      firstDayContact: currentUser,
      startTime: "09:00 AM",
      teamviewerLicenseType:
        "TeamViewer Lite - Up to 19 connections per month ($1000)",
      tableauAccessType: "Viewer",
      workingHoursOptions: "Full Time Hours"
    },
    shouldUnregister: true
  });

  const history = useNavigate();

  form.watch([
    "workingHoursOptions",
    "primaryOffice",
    "teamMemberLevel",
    "baseSalary",
    "commission",
    "isGenesysRequired",
    "genesysAgentGroup",
    "isMobilePhoneRequired",
    "isPortACurrentNumberRequired",
    "projectType",
    "employmentTypeOptions",
    "workingRightsOptions",
    "startDate",
    "endDate",
    "teamviewerLicenseType",
    "tableauAccessType",
    "positionTitle",
    "_positionTitle"
  ]);

  const onSubmit = async data => {
    setLoading(true);
    const sanitisedData = sanitiseFormData(data);
    const formattedData = { ...sanitisedData, jobReqId: jobReqId };
    try {
      const response = await submitOnboardingForm(formattedData);
      setLoading(false);
      if (response.status === HttpStatus.CREATED) {
        history("/success", {
          messages: ["Onboarding form has been successfully submitted."]
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

  // For vanilla form we don't have any job data from Cornerstone
  const [formData, setFormData] = useState({ employees, jobData: undefined });
  useEffect(() => {
    const getJobData = async () => {
      const response = await getOnboardingFormByCornerstoneId(
        jobReqId,
        applicantId
      );
      if (response.status !== HttpStatus.OK) {
        return history("/error", {
          messages: [response.data.message]
        });
      }
      const jobData = JobDataDto.create(response.data);
      setFormData({ employees, jobData: jobData });
    };
    if (isNotNilEmpty(jobReqId)) {
      getJobData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobReqId]);

  return (
    <>
      {isNil(currentUser) && <CardWithLoadingStatus />}
      {!isNil(currentUser) && (
        <FormProvider {...form}>
          <FormHorizontal layout="primary">
            <PageHead title="Onboarding Form" />
            <form>
              <div className={loading ? "hidden" : "shown"}>
                <Card
                  title={"Employee Details"}
                  body={<EmployeeDetails formData={formData} />}
                />
                <Card
                  title={"Position Details"}
                  body={<PositionDetails formData={formData} />}
                />
                <Card
                  title={"Agreement Details"}
                  body={<AgreementDetails jobData={formData.jobData} />}
                />
                <FinanceDetails />
                <Card
                  title={"IT Details"}
                  body={<ItDetails employees={employees} />}
                />
                <ButtonRow>
                  <Button tone="neutral" onClick={() => history(-1)}>
                    Cancel
                  </Button>
                  <Button tone="success" onClick={form.handleSubmit(onSubmit)}>
                    Submit
                  </Button>
                </ButtonRow>
              </div>
              <div>
                {loading && (
                  <PageState
                    title="Loading..."
                    description="Onboarding form is submitting"
                    image={<Spinner size="medium" />}
                  ></PageState>
                )}
              </div>
            </form>
          </FormHorizontal>
        </FormProvider>
      )}
    </>
  );
};

export default OnboardingCreate;
