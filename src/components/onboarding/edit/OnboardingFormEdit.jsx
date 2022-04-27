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
import { useNavigate, useLocation } from "react-router-dom";
import HttpStatus from "http-status-codes";

import Card from "../../common/Card";
import { onboardingSchema } from "../common/onboardingSchema";
import AgreementDetails from "../common/AgreementDetails";
import EmployeeDetails from "../common/EmployeeDetails";
import FinanceDetails from "../../common/FinanceDetails";
import ItDetails from "../common/ItDetails";
import PositionDetails from "../common/PositionDetails";
import EmployeeServicesSection from "./EmployeeServicesSection";
import CancelReason from "../../common/CancelReason";
import useFormStatus from "../../../entities/useFormStatus";
import { StatusContext, StatusProvider } from "../../../entities/StatusContext";
import {
  checkPermissionForOnboarding,
  getOnboardingFormById,
  updateOnboardingForm
} from "../../../apis/kilnBackendApis";
import OnboardingFormFrontendDto from "../dto/OnboardingFormFrontendDto";
import UserContext from "../../../auth/UserContext";
import UserFactory from "../../../factories/UserFactory";
import CardWithLoadingStatus from "../../common/CardWithLoadingStatus";
import {
  isIncluded,
  isNotNilEmpty,
  sanitiseFormData,
  calculateProbationPeriod,
  isLocationInPreviewMode
} from "../../../utils";
import BulkOnboardingDetails from "./BulkOnboardingDetails";

const ACCESS_DENIED_ERROR = [
  "Sorry, Employment Forms access is restricted to MYOB People Leaders.",
  "If you do believe you should have access, please contact your manager or People Consultants, or raise a HelpMe ticket."
];

const OnboardingFormEdit = props => {
  const currentUser = useContext(UserContext);
  const history = useNavigate();
  const formId = props.match.params.id;
  const employees = props.employees || [];
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const isPreviewMode = isLocationInPreviewMode(location);
  const { toggleStatus } = useFormStatus();
  const [status] = useContext(StatusContext);
  const [formEvaluationStatus, setFormEvaluationStatus] = useState("");
  const [isBulkOnboarding, setIsBulkOnboarding] = useState(false);

  const form = useForm({
    resolver: yupResolver(onboardingSchema),
    mode: "all",
    shouldUnregister: true
  });

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
    "directManager",
    "teamMemberLevel",
    "creditCard",
    "delegatedApprovalAuthority",
    "tableauAccessType",
    "teamviewerLicenseType",
    "positionTitle",
    "_positionTitle"
  ]);

  const {
    handleSubmit: handleSaveAndUpdate,
    handleSubmit: handleSaveAndApprove,
    handleSubmit: handleUpdateRequested,
    handleSubmit: handleCancel,
    handleSubmit: handleSkipContract,
    handleSubmit: handleSkipForm,
    handleSubmit: handleReopen,
    handleSubmit: handleUpdate
  } = form;

  const handleFormEvaluation = {
    handleSaveAndUpdate,
    handleSaveAndApprove,
    handleUpdateRequested,
    handleCancel,
    handleSkipContract,
    handleSkipForm,
    handleReopen,
    handleUpdate
  };

  const shouldDisableFormOnPreview = () => {
    if (isPreviewMode) {
      toggleStatus();
    }
  };

  const redirectToPreviewAfterFormApproval = () => {
    if (isApproved) {
      history(`/form/onboarding/${formId}/preview`);
    }
  };

  const checkIfApproved = status => {
    return isIncluded(
      [
        "APPROVED",
        "CONTRACT_SKIPPED",
        "ALL_SKIPPED",
        "ONBOARDING",
        "EMPLOYEE_STARTED",
        "CONTRACT_SIGNED"
      ],
      status
    );
  };

  const isApproved = checkIfApproved(formEvaluationStatus.toUpperCase());
  const isReopened = formEvaluationStatus.toUpperCase().includes("REOPENED");
  const isCancelled = formEvaluationStatus.toUpperCase().includes("CANCELLED");

  // Calculate probation period for fixed-term employees using start and end date
  const [probationPeriod, setProbationPeriod] = useState("0");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  useEffect(() => {
    setProbationPeriod(calculateProbationPeriod(startDate, endDate));
  }, [startDate, endDate]);

  useEffect(() => {
    const verifyRole = async () => {
      const permissionResp = await checkPermissionForOnboarding(formId);
      if (permissionResp.status !== HttpStatus.OK) {
        history("/error", {
          messages: ACCESS_DENIED_ERROR
        });
      }
    };

    const fetchFormData = async () => {
      const response = await getOnboardingFormById(formId);
      if (response.status !== HttpStatus.OK) {
        return history("/error", {
          messages: [response.data.message]
        });
      }
      setFormEvaluationStatus(response.data.evaluationStatus ?? "");
      // Populate the form with the data from the backend
      const onboardingFormDto = OnboardingFormFrontendDto.create(response.data);
      isNotNilEmpty(onboardingFormDto) ? setLoading(false) : setLoading(true);
      setIsBulkOnboarding(
        isNotNilEmpty(onboardingFormDto.isAcquisition)
          ? onboardingFormDto.isAcquisition[0] === "acquisition"
          : false
      );
      form.reset(onboardingFormDto);
      setStartDate(onboardingFormDto.startDate);
      setEndDate(onboardingFormDto.endDate);
    };
    setLoading(true);
    // Verify they have the correct role to be able to access the page
    // before we bother fetching the data
    verifyRole();
    fetchFormData();
    shouldDisableFormOnPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.reset, location.pathname, history, formId]);

  useEffect(() => {
    redirectToPreviewAfterFormApproval();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formEvaluationStatus]);

  const changeLoading = check => {
    setLoading(check);
  };

  const changeDescription = description => {
    setDescription(description);
  };

  const onDateChange = (name, value) => {
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
  };

  const submit = async data => {
    try {
      const res = await updateOnboardingForm(formId, data);
      if (
        res.status === HttpStatus.NO_CONTENT ||
        res.status === HttpStatus.OK
      ) {
        history("/success", {
          messages: ["Onboarding form has been successfully submitted."]
        });
        return;
      }
      if (res.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
        return history("/error");
      }
      history("/error", {
        messages: [res.data.message],
        hideHelpMeTicketText: true
      });
    } catch (e) {
      history("/error", { errorMessage: e });
    }
  };

  const onSubmit = data => {
    const formattedData = sanitiseFormData(data);
    submit(formattedData);
  };

  // For vanilla form we don't have any job data from Cornerstone
  const formData = {
    employees,
    jobData: undefined
  };

  const shouldDisplayCancelOrBackButton = () => {
    const cancelButton = (
      <Button type="secondary" onClick={() => history(-1)}>
        Cancel
      </Button>
    );
    const backButton = (
      <Button type="secondary" onClick={() => history("/form/onboarding/list")}>
        Back to Dashboard
      </Button>
    );

    const hideSubmit = UserFactory.create(currentUser).hasFullAccess();
    const submitButton = (
      <Button
        onClick={handleUpdate(() => {
          onSubmit(form.getValues());
        })}
      >
        Submit
      </Button>
    );
    if (status.disabled) {
      return backButton;
    } else if (hideSubmit) {
      return cancelButton;
    }
    return (
      <>
        {cancelButton}
        {submitButton}
      </>
    );
  };

  return (
    <>
      {isNil(currentUser) && <CardWithLoadingStatus />}
      <div>
        {loading && (
          <PageState
            title="Loading..."
            description={description}
            image={<Spinner size="medium" />}
          ></PageState>
        )}
      </div>
      {!isNil(currentUser) && !loading && (
        <FormProvider {...form}>
          <FormHorizontal layout="primary">
            <PageHead title="Onboarding Form" />
            <form>
              <div className={loading ? "hidden" : "shown"}>
                <Card
                  title={"Employee Details"}
                  body={
                    <EmployeeDetails
                      formData={formData}
                      onDateChangeFunc={onDateChange}
                    />
                  }
                />
                <Card
                  title={"Position Details"}
                  body={<PositionDetails formData={formData} />}
                />
                <Card
                  title={"Agreement Details"}
                  body={<AgreementDetails jobData={undefined} />}
                />
                <FinanceDetails />
                <Card
                  title={"IT Details"}
                  body={<ItDetails employees={employees} />}
                />
                {isCancelled && (
                  <Card title={"Cancel Reason"} body={<CancelReason />} />
                )}
                {UserFactory.create(currentUser).hasFullAccess() && (
                  <>
                    {isBulkOnboarding && (
                      <Card
                        title={"Bulk Onboarding"}
                        body={<BulkOnboardingDetails />}
                      />
                    )}
                    <Card
                      title={"Employee Services Only"}
                      body={
                        <>
                          <StatusProvider value={undefined}>
                            <EmployeeServicesSection
                              formId={formId}
                              handleSubmitFunc={handleFormEvaluation}
                              isApproved={isApproved}
                              isCancelled={isCancelled}
                              isReopened={isReopened}
                              loadingCallback={changeLoading}
                              changeDescription={changeDescription}
                              probationPeriod={probationPeriod}
                            />
                          </StatusProvider>
                        </>
                      }
                    />
                  </>
                )}
                <ButtonRow>{shouldDisplayCancelOrBackButton()}</ButtonRow>
              </div>
            </form>
          </FormHorizontal>
        </FormProvider>
      )}
    </>
  );
};

export default OnboardingFormEdit;
