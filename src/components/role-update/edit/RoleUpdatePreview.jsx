import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  ButtonRow,
  FormHorizontal,
  PageHead,
  PageState,
  Spinner
} from "@myob/myob-widgets";
import HttpStatus from "http-status-codes";
import { isNil } from "ramda";
import React, { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import EmployeeServicesSection from "./EmployeeServicesSection";
import AgreementDetails from "../common/AgreementDetails";
import ChangeType from "../common/ChangeType";
import EmployeeName from "../common/EmployeeName";
import NewPositionDetails from "../common/NewPositionDetails";
import ITDetails from "../common/ITDetails";
import CancelReason from "../../common/CancelReason";
import { roleUpdateMetaData } from "../common/roleUpdateMetaData";
import { commonMetaData } from "../../common/commonMetaData";
import { roleUpdateSchema } from "../common/roleUpdateSchema";
import RoleUpdateFormFrontendDto from "../dto/RoleUpdateFormFrontendDto";
import Card from "../../common/Card";
import CardWithLoadingStatus from "../../common/CardWithLoadingStatus";
import FinanceDetails from "../../common/FinanceDetails";
import {
  submitRoleUpdateForm,
  checkPermissionForRoleUpdate,
  getRoleUpdateFormById
} from "../../../apis/kilnBackendApis";
import UserContext from "../../../auth/UserContext";
import { StatusContext, StatusProvider } from "../../../entities/StatusContext";
import useFormStatus from "../../../entities/useFormStatus";
import { isNotNilEmpty, sanitiseFormData } from "../../../utils";
import UserFactory from "../../../factories/UserFactory";

const ACCESS_DENIED_ERROR = [
  "Sorry, Employment Forms access is restricted to MYOB People Leaders.",
  "If you do believe you should have access, please contact your manager or People Consultants, or raise a HelpMe ticket."
];

const RoleUpdatePreview = props => {
  const currentUser = useContext(UserContext);
  const employees = props.employees || [];
  const [loading, setLoading] = useState(false);
  const { toggleStatus } = useFormStatus();
  const [status] = useContext(StatusContext);
  const history = useNavigate();
  const formId = props.match.params.id;

  const form = useForm({
    mode: "all",
    resolver: yupResolver(roleUpdateSchema),
    shouldUnregister: true
  });
  form.watch();

  // handle form submission
  const {
    handleSubmit: handleSaveAndUpdate,
    handleSubmit: handleSaveAndApprove,
    handleSubmit: handleCancel,
    handleSubmit: handleSkipContract,
    handleSubmit: handleSkipForm,
    handleSubmit: handleReopen,
    handleSubmit: handleUpdate
  } = form;

  const handleFormEvaluation = {
    handleSaveAndUpdate,
    handleSaveAndApprove,
    handleCancel,
    handleSkipContract,
    handleSkipForm,
    handleReopen,
    handleUpdate
  };

  // used to determine which sections to show
  const [selectedThirdPartyChange, setSelectedThirdPartyChange] = useState("");
  const [selectedPermanentChange, setSelectedPermanentChange] = useState("");
  const [selectedSecondmentChange, setSelectedSecondmentChange] = useState("");
  const [selectedFixedTermChange, setSelectedFixedTermChange] = useState("");
  const [selectedCasualChange, setSelectedCasualChange] = useState("");
  const [selectedParentalLeaveChange, setSelectedParentalLeaveChange] =
    useState("");

  // used in Employee Services section
  const [showPreviewButton, setShowPreviewButton] = useState(false);
  const [showSaveAndUpdateButton, setShowSaveAndUpdateButton] = useState(false);
  const [showSaveAndApproveButton, setShowSaveAndApproveButton] =
    useState(false);
  const [showSkipContractButton, setShowSkipContractButton] = useState(false);
  const [showSkipContractAndFormsButton, setShowSkipContractAndFormsButton] =
    useState(false);
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [showReopenButton, setShowReopenButton] = useState(false);
  const [cancelButtonText, setCancelButtonText] = useState("");
  const [showCancelReasons, setShowCancelReasons] = useState(false);

  // get form data from backend
  useEffect(() => {
    const verifyRole = async () => {
      const permissionResp = await checkPermissionForRoleUpdate(formId);
      if (permissionResp.status !== HttpStatus.OK) {
        history("/error", {
          messages: ACCESS_DENIED_ERROR
        });
      }
    };

    const setEmployeeServicesSection = data => {
      // don't show buttons for forms that are finished
      if (data.status === "COMPLETED" || data.status === "CANCELLED") {
        setShowPreviewButton(false);
        setShowSaveAndUpdateButton(false);
        setShowSaveAndApproveButton(false);
        setShowSkipContractButton(false);
        setShowSkipContractAndFormsButton(false);
        setShowCancelButton(false);
        setShowReopenButton(false);
        setCancelButtonText("");
      } else if (
        data.evaluationStatus === "UNEVALUATED" ||
        data.evaluationStatus === "REOPENED"
      ) {
        // can't reopen a form in 'unevaluated' or already 'reopened' state
        setShowReopenButton(false);
        // 3rd party contract extension only shows 'save & approve' and 'cancel' buttons
        if (
          data.thirdPartyChangeType ===
          roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[2].label
        ) {
          setShowPreviewButton(false);
          setShowSaveAndUpdateButton(false);
          setShowSaveAndApproveButton(true);
          setShowSkipContractButton(false);
          setShowSkipContractAndFormsButton(false);
          setShowCancelButton(true);
          setCancelButtonText(
            roleUpdateMetaData.cancelButton.cancelContractorContractExtension
          );
        } else if (
          data.thirdPartyChangeType ===
            roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[3]
              .label ||
          data.permanentChangeType ===
            roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[3]
              .label ||
          data.fixedTermChangeType ===
            roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[4]
              .label ||
          data.secondmentChangeType ===
            roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[3]
              .label ||
          data.casualChangeType ===
            roleUpdateMetaData.changeType.casualChangeType.OPTIONS[2].label ||
          data.parentalLeaveChangeType ===
            roleUpdateMetaData.changeType.parentalLeaveChangeType.OPTIONS[0]
              .label
        ) {
          // don't the employee services buttons if it's a reporting line change
          setShowPreviewButton(false);
          setShowSaveAndUpdateButton(false);
          setShowSaveAndApproveButton(false);
          setShowSkipContractButton(false);
          setShowSkipContractAndFormsButton(false);
          setShowCancelButton(false);
          setCancelButtonText("Cancel");
        } else {
          setShowPreviewButton(true);
          setShowSaveAndUpdateButton(true);
          setShowSaveAndApproveButton(true);
          setShowSkipContractButton(true);
          setShowSkipContractAndFormsButton(false);
          setShowCancelButton(true);
          setCancelButtonText("Cancel");
        }
        // only show skip forms when it's 3rd party contractor -> permanent/fixed-term
        if (
          data.thirdPartyChangeType ===
            roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[0]
              .label ||
          data.thirdPartyChangeType ===
            roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[1].label
        ) {
          setShowSkipContractAndFormsButton(true);
        }
      } else if (
        data.evaluationStatus === "APPROVED" ||
        data.evaluationStatus === "CONTRACT_SKIPPED" ||
        data.evaluationStatus === "ALL_SKIPPED" ||
        data.evaluationStatus === "CONTRACT_SIGNED"
      ) {
        setShowPreviewButton(false);
        setShowSaveAndUpdateButton(false);
        setShowSaveAndApproveButton(false);
        setShowSkipContractButton(false);
        setShowSkipContractAndFormsButton(false);
        setShowCancelButton(true);
        setShowReopenButton(true);
        setCancelButtonText("Cancel");
      } else if (data.evaluationStatus === "CANCELLED") {
        setShowCancelReasons(true);
      }

      // cancel button text changes contextually
      if (
        data.permanentChangeType ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[0].label
      ) {
        setCancelButtonText(roleUpdateMetaData.cancelButton.cancelTransfer);
      } else if (
        data.permanentChangeType ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[1].label
      ) {
        setCancelButtonText(roleUpdateMetaData.cancelButton.cancelSecondment);
      } else if (
        data.permanentChangeType ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[2].label
      ) {
        setCancelButtonText(
          roleUpdateMetaData.cancelButton.cancelChangeOfTerms
        );
      } else if (
        data.permanentChangeType ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[4].label
      ) {
        setCancelButtonText(
          roleUpdateMetaData.cancelButton.cancelTransferToFixedTerm
        );
      } else if (
        data.permanentChangeType ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[5].label
      ) {
        setCancelButtonText(
          roleUpdateMetaData.cancelButton.cancelTransferToCasual
        );
      } else if (
        data.fixedTermChangeType ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[0].label
      ) {
        setCancelButtonText(
          roleUpdateMetaData.cancelButton.cancelFixedTermContractExtension
        );
      } else if (
        data.fixedTermChangeType ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[1].label
      ) {
        setCancelButtonText(
          roleUpdateMetaData.cancelButton.cancelFixedTermToPermanent
        );
      } else if (
        data.fixedTermChangeType ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[2].label
      ) {
        setCancelButtonText(
          roleUpdateMetaData.cancelButton.cancelFixedTermToNewPosition
        );
      } else if (
        data.secondmentChangeType ===
        roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[0].label
      ) {
        setCancelButtonText(
          roleUpdateMetaData.cancelButton.cancelSecondmentExtension
        );
      } else if (
        data.secondmentChangeType ===
        roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[1].label
      ) {
        setCancelButtonText(
          roleUpdateMetaData.cancelButton.cancelSecondmentToPermanent
        );
      } else if (
        data.casualChangeType ===
        roleUpdateMetaData.changeType.casualChangeType.OPTIONS[0].label
      ) {
        setCancelButtonText(
          roleUpdateMetaData.cancelButton.cancelCasualToPermanent
        );
      } else if (
        data.casualChangeType ===
        roleUpdateMetaData.changeType.casualChangeType.OPTIONS[1].label
      ) {
        setCancelButtonText(
          roleUpdateMetaData.cancelButton.cancelCasualToFixedTerm
        );
      } else if (
        data.thirdPartyChangeType ===
        roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[0].label
      ) {
        setCancelButtonText(
          roleUpdateMetaData.cancelButton.cancelContractorToPermanent
        );
      } else if (
        data.thirdPartyChangeType ===
        roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[1].label
      ) {
        setCancelButtonText(
          roleUpdateMetaData.cancelButton.cancelContractorToFixedTerm
        );
      }
    };

    const forceSetDirectManager = data => {
      const directManagerFromFormData = {
        ...Object.freeze(data?.directManager)
      };
      const directManagerEnriched = employees.find(
        employee => employee?.fullName === directManagerFromFormData?.fullName
      );
      if (directManagerEnriched) {
        form.setValue(
          commonMetaData.directManager.NAME,
          directManagerEnriched,
          {
            shouldValidate: true
          }
        );
      }
    };

    const fetchFormData = async () => {
      const response = await getRoleUpdateFormById(formId);
      if (response.status !== HttpStatus.OK) {
        return history("/error", {
          messages: [response.data.message]
        });
      }
      // Populate the form with the data from the backend
      const roleUpdateFormDto = RoleUpdateFormFrontendDto.create(response.data);
      isNotNilEmpty(roleUpdateFormDto) ? setLoading(false) : setLoading(true);
      if (roleUpdateFormDto.evaluationStatus === "REOPENED") {
        return history(`/form/role-update/${formId}/edit`);
      }
      form.reset(roleUpdateFormDto);
      // Set values to determine which parts of the form to show
      setSelectedThirdPartyChange(roleUpdateFormDto.thirdPartyChangeType);
      setSelectedPermanentChange(roleUpdateFormDto.permanentChangeType);
      setSelectedSecondmentChange(roleUpdateFormDto.secondmentChangeType);
      setSelectedFixedTermChange(roleUpdateFormDto.fixedTermChangeType);
      setSelectedCasualChange(roleUpdateFormDto.casualChangeType);
      setSelectedParentalLeaveChange(roleUpdateFormDto.parentalLeaveChangeType);
      setEmployeeServicesSection(roleUpdateFormDto);
      forceSetDirectManager(roleUpdateFormDto);
    };

    setLoading(true);
    // Verify they have the correct role to be able to access the page before we bother fetching the data
    verifyRole();
    fetchFormData();
    toggleStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.reset, history, formId]);

  // Set loading screen and loading screen text
  const changeLoading = isLoading => {
    setLoading(isLoading);
  };
  const [description, setDescription] = useState("The request is submitting");
  const changeDescription = description => {
    setDescription(description);
  };

  const shouldDisplayCancelOrBackButton = () => {
    const cancelButton = (
      <Button tone="neutral" onClick={() => history(-1)}>
        Cancel
      </Button>
    );
    const backButton = (
      <Button tone="neutral" onClick={() => history("/form/role-update/list")}>
        Back to Dashboard
      </Button>
    );

    const hideSubmit = UserFactory.create(currentUser).hasFullAccess();
    const submitButton = (
      <Button
        tone="success"
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

  const onSubmit = async data => {
    setLoading(true);
    try {
      const finalData = {
        employeeId: data.employee.id,
        ...sanitiseFormData(data)
      };
      const response = await submitRoleUpdateForm(finalData);
      setLoading(false);
      if (response.status === HttpStatus.CREATED) {
        history("/success", {
          messages: ["Role Update form has been successfully submitted."],
          button: {
            clickUrl: "/form/role-update/list"
          }
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

  // This section always shown unless it was a reporting line change or
  // 3rd party contract extension
  const [showAgreementDetails, setShowAgreementDetails] = useState(false);
  useEffect(() => {
    if (
      selectedPermanentChange ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[3].label ||
      selectedFixedTermChange ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[4].label ||
      selectedThirdPartyChange ===
        roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[2].label ||
      selectedThirdPartyChange ===
        roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[3].label ||
      selectedSecondmentChange ===
        roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[3].label ||
      selectedCasualChange ===
        roleUpdateMetaData.changeType.casualChangeType.OPTIONS[2].label ||
      selectedParentalLeaveChange ===
        roleUpdateMetaData.changeType.parentalLeaveChangeType.OPTIONS[0].label
    ) {
      setShowAgreementDetails(false);
    } else if (!loading) {
      setShowAgreementDetails(true);
    }
  }, [
    selectedPermanentChange,
    selectedThirdPartyChange,
    selectedSecondmentChange,
    selectedFixedTermChange,
    selectedCasualChange,
    selectedParentalLeaveChange,
    loading
  ]);

  // This section is always shown unless it was a reporting line change,
  // change to terms of current role, or 3rd party contract extension
  const [showFinanceDetails, setShowFinanceDetails] = useState(false);
  useEffect(() => {
    if (
      selectedPermanentChange ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[2].label ||
      selectedPermanentChange ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[3].label ||
      selectedFixedTermChange ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[3].label ||
      selectedFixedTermChange ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[4].label ||
      selectedThirdPartyChange ===
        roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[2].label ||
      selectedThirdPartyChange ===
        roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[3].label ||
      selectedSecondmentChange ===
        roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[2].label ||
      selectedSecondmentChange ===
        roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[3].label ||
      selectedCasualChange ===
        roleUpdateMetaData.changeType.casualChangeType.OPTIONS[2].label ||
      selectedParentalLeaveChange ===
        roleUpdateMetaData.changeType.parentalLeaveChangeType.OPTIONS[0].label
    ) {
      setShowFinanceDetails(false);
    } else if (!loading) {
      setShowFinanceDetails(true);
    }
  }, [
    selectedPermanentChange,
    selectedThirdPartyChange,
    selectedSecondmentChange,
    selectedFixedTermChange,
    selectedCasualChange,
    selectedParentalLeaveChange,
    loading
  ]);

  // This section is always shown unless it was a reporting line change,
  // change to terms of current role, 3rd party contract extension,
  // fixed-term to permanent, fixed-term contract extension,
  // or any type of secondment change
  const [showItDetails, setShowItDetails] = useState(false);
  useEffect(() => {
    if (
      selectedPermanentChange ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[2].label ||
      selectedPermanentChange ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[3].label ||
      selectedFixedTermChange ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[0].label ||
      selectedFixedTermChange ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[1].label ||
      selectedFixedTermChange ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[3].label ||
      selectedFixedTermChange ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[4].label ||
      selectedThirdPartyChange ===
        roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[2].label ||
      selectedThirdPartyChange ===
        roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[3].label ||
      selectedSecondmentChange ===
        roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[0].label ||
      selectedSecondmentChange ===
        roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[1].label ||
      selectedSecondmentChange ===
        roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[2].label ||
      selectedSecondmentChange ===
        roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[3].label ||
      selectedCasualChange ===
        roleUpdateMetaData.changeType.casualChangeType.OPTIONS[2].label ||
      selectedParentalLeaveChange ===
        roleUpdateMetaData.changeType.parentalLeaveChangeType.OPTIONS[0].label
    ) {
      setShowItDetails(false);
    } else if (!loading) {
      setShowItDetails(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedPermanentChange,
    selectedThirdPartyChange,
    selectedSecondmentChange,
    selectedFixedTermChange,
    selectedCasualChange,
    selectedParentalLeaveChange,
    loading
  ]);

  // This section always shown unless it was a 3rd party contract extension
  const [showPositionDetails, setShowPositionDetails] = useState(false);
  useEffect(() => {
    if (
      selectedThirdPartyChange ===
      roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[2].label
    ) {
      setShowPositionDetails(false);
    } else {
      setShowPositionDetails(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedThirdPartyChange, loading]);

  const fixedTermStartDate = form.getValues(
    roleUpdateMetaData.changeType.effectiveDate.NAME
  );
  const fixedTermEndDate = form.getValues(
    roleUpdateMetaData.changeType.fixedTermEndDate.NAME
  );

  const probationPeriodProps = {
    shouldDisplay:
      selectedThirdPartyChange ===
        roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[1].label &&
      isNotNilEmpty(fixedTermStartDate) &&
      isNotNilEmpty(fixedTermEndDate),
    fixedTermStartDate,
    fixedTermEndDate
  };

  return (
    <>
      {isNil(currentUser) && <CardWithLoadingStatus />}
      {loading && <CardWithLoadingStatus />}
      {!isNil(currentUser) && !loading && (
        <FormProvider {...form}>
          <FormHorizontal layout="primary">
            <form>
              <div className={loading ? "hidden" : "shown"}>
                <PageHead title="Role Update / Transfer Form" />
                <EmployeeName users={employees} />
                <ChangeType />
                {showPositionDetails && (
                  <NewPositionDetails users={employees} />
                )}
                {showAgreementDetails && <AgreementDetails />}
                {showFinanceDetails && <FinanceDetails />}
                {showItDetails && <ITDetails users={employees} />}
                {showCancelReasons && (
                  <Card title={"Cancel Reason"} body={<CancelReason />} />
                )}
                {UserFactory.create(currentUser).hasFullAccess() && (
                  <Card
                    title={"Employee Services Only"}
                    body={
                      <>
                        <StatusProvider value={undefined}>
                          <EmployeeServicesSection
                            formId={formId}
                            handleSubmitFunc={handleFormEvaluation}
                            loadingCallback={changeLoading}
                            changeDescription={changeDescription}
                            showPreviewButton={showPreviewButton}
                            showSaveAndUpdateButton={showSaveAndUpdateButton}
                            showSaveAndApproveButton={showSaveAndApproveButton}
                            showSkipContractButton={showSkipContractButton}
                            showSkipContractAndFormsButton={
                              showSkipContractAndFormsButton
                            }
                            showCancelButton={showCancelButton}
                            showReopenButton={showReopenButton}
                            cancelButtonText={cancelButtonText}
                            probationPeriodProps={probationPeriodProps}
                          />
                        </StatusProvider>
                      </>
                    }
                  />
                )}
                <ButtonRow>{shouldDisplayCancelOrBackButton()}</ButtonRow>
              </div>
              <div>
                {loading && (
                  <PageState
                    title="Please wait..."
                    description={description}
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

export default RoleUpdatePreview;
