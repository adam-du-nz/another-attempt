import { addDays, parse } from "date-fns";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  ButtonRow,
  Button,
  FormHorizontal,
  Separator,
  Modal
} from "@myob/myob-widgets";
import { sanitiseFormData } from "../../../utils/index.js";
import { commonMetaData } from "../../common/commonMetaData";
import { onboardingFormMetaData } from "../common/onboardingFormMetaData";
import { EEFormCheckbox, EEFormInput } from "../../common/form-fields";
import { getWebMergeContractPreview } from "../../../apis/awsApis";
import OnboardingFormFrontendDto from "../dto/OnboardingFormFrontendDto";
import {
  cancelOnboardingForm,
  reopenOnboardingForm,
  updateOnboardingForm,
  getOnboardingFormById,
  requestUpdateToOnboardingForm,
  skipOnboardingContract,
  skipOnboardingContractAndEmploymentForms
} from "../../../apis/kilnBackendApis";
import HttpStatus from "http-status-codes";
import { useNavigate } from "react-router-dom";

const EmployeeServicesSection = props => {
  const { getValues, reset } = useFormContext();
  const history = useNavigate();
  const {
    formId,
    handleSubmitFunc,
    isApproved,
    isCancelled,
    isReopened,
    loadingCallback,
    changeDescription,
    probationPeriod
  } = props;
  const {
    handleSaveAndUpdate,
    handleSaveAndApprove,
    handleCancel,
    handleReopen,
    handleSkipContract,
    handleSkipForm
  } = handleSubmitFunc;

  const [hideSaveAndUpdateButton, setHideSaveAndUpdateButton] = useState(false);
  const [hidePreviewButton, setHidePreviewButton] = useState(false);
  const [hideRequestUpdateButton, setHideRequestUpdateButton] = useState(false);
  const [hideSaveAndApproveButton, setHideSaveAndApproveButton] =
    useState(false);
  const [hideSkipButton, setHideSkipButton] = useState(false);
  const [hideReopenButton, setHideReopenButton] = useState(false);
  const [hideCancelOnboardingButton, setHideCancelOnboardingButton] =
    useState(false);

  const fetchFormData = async formId => {
    const response = await getOnboardingFormById(formId);
    if (response.status !== HttpStatus.OK) {
      return history("/error", {
        messages: [response.data.message]
      });
    }
    const onboardingFormDto = OnboardingFormFrontendDto.create(response.data);
    reset(onboardingFormDto);
  };
  useEffect(() => {
    setHideSaveAndUpdateButton(isApproved || isCancelled);
    setHidePreviewButton(isApproved || isCancelled);
    setHideRequestUpdateButton(isApproved || isReopened || isCancelled);
    setHideSaveAndApproveButton(isApproved || isCancelled);
    setHideSkipButton(isApproved || isCancelled);
    setHideReopenButton(isReopened || !isApproved || isCancelled);
    setHideCancelOnboardingButton(isCancelled);
  }, [isApproved, isReopened, isCancelled]);

  const submit = async data => {
    loadingCallback(true);
    try {
      const res = await updateOnboardingForm(formId, data);
      loadingCallback(false);
      if (
        res.status === HttpStatus.NO_CONTENT ||
        res.status === HttpStatus.OK
      ) {
        return history("/success", {
          messages: ["Onboarding form has been successfully updated."],
          button: {
            clickUrl: "/form/onboarding/list"
          },
          hideHelpMeTicketText: true
        });
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

  const onSaveAndUpdate = data => {
    changeDescription("Onboarding form is saving");
    const formattedData = sanitiseFormData(data);
    const status = isReopened ? "REOPENED" : "UNEVALUATED";
    const updateData = {
      ...formattedData,
      evaluationStatus: status,
      isUpdate: true
    };
    submit(updateData);
  };

  const onSaveAndApprove = data => {
    changeDescription("Onboarding form is approving");
    const formattedData = sanitiseFormData(data);
    const status = isReopened ? "REOPENED" : "APPROVED";
    const afterApprovalData = {
      ...formattedData,
      evaluationStatus: status,
      isUpdate: false
    };
    submit(afterApprovalData);
  };

  const onReopen = async () => {
    changeDescription("Onboarding form is re-opening");
    loadingCallback(true);
    try {
      const res = await reopenOnboardingForm(formId);
      loadingCallback(false);
      if (res.status === HttpStatus.NO_CONTENT) {
        return history(`/form/onboarding/${formId}/edit`);
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

  const onSkipContract = async data => {
    changeDescription("Skipping contract for onboarding form");
    loadingCallback(true);
    try {
      const formattedData = sanitiseFormData(data);
      const status = isReopened ? "REOPENED" : "CONTRACT_SKIPPED";
      const skipContractData = {
        ...formattedData,
        evaluationStatus: status
      };
      const res = await skipOnboardingContract(formId, skipContractData);
      loadingCallback(false);
      if (res.status === HttpStatus.NO_CONTENT) {
        return history("/success", {
          messages: ["Contract has been successfully skipped."],
          button: {
            clickUrl: "/form/onboarding/list"
          },
          hideHelpMeTicketText: true
        });
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

  const onSkipContractAndForms = async data => {
    changeDescription(
      "Skipping contract and employment forms for onboarding form"
    );
    loadingCallback(true);
    try {
      const formattedData = sanitiseFormData(data);
      const status = isReopened ? "REOPENED" : "ALL_SKIPPED";
      const skipData = {
        ...formattedData,
        evaluationStatus: status
      };
      const res = await skipOnboardingContractAndEmploymentForms(
        formId,
        skipData
      );
      loadingCallback(false);
      if (res.status === HttpStatus.NO_CONTENT) {
        return history("/success", {
          messages: [
            "Contract and employment forms have been successfully skipped."
          ],
          button: {
            clickUrl: "/form/onboarding/list"
          },
          hideHelpMeTicketText: true
        });
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

  const [cancelReason, setCancelReason] = useState("");
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const showOrHideCancelModal = () => {
    setShowCancelConfirmation(!showCancelConfirmation);
  };
  const onCancel = () => {
    showOrHideCancelModal();
  };
  const cancelForm = async () => {
    showOrHideCancelModal();
    try {
      changeDescription("Cancelling onboarding form");
      loadingCallback(true);
      const res = await cancelOnboardingForm(formId, cancelReason);
      loadingCallback(false);
      if (res.status === HttpStatus.NO_CONTENT) {
        return history("/success", {
          messages: ["Onboarding form has been cancelled successfully."],
          button: {
            clickUrl: "/form/onboarding/list"
          }
        });
      }
      if (res.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
        return history("/error");
      }
      history("/error", {
        messages: [res.data.message],
        hideHelpMeTicketText: true
      });
    } catch (e) {
      history("/error");
    }
  };

  const [updateRequestReason, setUpdateRequestReason] = useState("");
  const [showUpdateRequestModal, setShowUpdateRequestModal] = useState(false);

  // Work out if the form is cancellable
  const startDate = getValues(
    onboardingFormMetaData.employeeDetails.startDate.NAME
  );
  const [cannotCancel, setCannotCancel] = useState(false);
  useEffect(() => {
    const isFormCancellable = start => {
      if (isCancelled) {
        setCannotCancel(true);
      } else {
        const startDate = parse(start, "yyyy-MM-dd", new Date());
        const sevenDays = addDays(Date.now(), 7);
        setCannotCancel(startDate <= sevenDays);
      }
    };
    isFormCancellable(startDate);
  }, [startDate, isCancelled]);

  /**
   * Generates a preview of the contract and downloads it.
   */
  const onPreview = async data => {
    changeDescription("Generating contract preview");
    loadingCallback(true);
    // save the form first so the preview shows the data the user
    // currently has in front of them
    const formattedData = sanitiseFormData(data);
    const status = isReopened ? "REOPENED" : "UNEVALUATED";
    const updateData = {
      ...formattedData,
      evaluationStatus: status,
      isUpdate: true
    };
    try {
      const res = await updateOnboardingForm(formId, updateData);
      if (res.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
        loadingCallback(false);
        return history("/error");
      }
      await fetchFormData(formId);
    } catch (e) {
      history("/error", { errorMessage: e });
    }
    // generate preview
    const result = await getWebMergeContractPreview({
      formId: formId,
      formType: "ONBOARDING"
    });
    const file = new Blob([result.data], { type: "application/pdf" });
    const fileUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "contract_preview.pdf");
    loadingCallback(false);
    document.body.appendChild(link);
    link.click();
  };

  const showOrHideRequestUpdateModal = () => {
    setShowUpdateRequestModal(!showUpdateRequestModal);
  };

  const handleRequestUpdate = async () => {
    showOrHideRequestUpdateModal();
    changeDescription("Requesting update for onboarding form");
    loadingCallback(true);
    try {
      const res = await requestUpdateToOnboardingForm(
        formId,
        updateRequestReason
      );
      if (res.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
        loadingCallback(false);
        return history("/error");
      }
    } catch (e) {
      history("/error", { errorMessage: e });
    }
    loadingCallback(false);
  };

  const employmentType =
    onboardingFormMetaData.employeeDetails.employmentTypeOptions.NAME;
  const fixedTerm =
    onboardingFormMetaData.employeeDetails.employmentTypeOptions.OPTIONS[1]
      .label;
  const teamMemberLevel = commonMetaData.teamMemberLevel.NAME;
  const workingRights =
    onboardingFormMetaData.employeeDetails.workingRightsOptions.NAME;
  const current =
    onboardingFormMetaData.employeeDetails.workingRightsOptions.OPTIONS[0]
      .label;

  return (
    <FormHorizontal>
      {getValues(employmentType) === fixedTerm && (
        <EEFormInput
          id={commonMetaData.probationPeriod.NAME}
          name={commonMetaData.probationPeriod.NAME}
          label={commonMetaData.probationPeriod.LABEL}
          value={probationPeriod}
          disabled
        />
      )}
      {(getValues(teamMemberLevel) === "SLT" ||
        getValues(teamMemberLevel) === "ELT") && (
        <>
          <EEFormInput
            id={
              onboardingFormMetaData.employeeServicesSection.ebpPercentage.NAME
            }
            name={
              onboardingFormMetaData.employeeServicesSection.ebpPercentage.NAME
            }
            label={
              onboardingFormMetaData.employeeServicesSection.ebpPercentage.LABEL
            }
            type={"number"}
          />
          <div className="form-group">
            <div className={"form-group__label-group"}></div>
            <div className={"form-group__input-group"}>
              <EEFormCheckbox
                id={onboardingFormMetaData.employeeServicesSection.sendEBP.NAME}
                name={
                  onboardingFormMetaData.employeeServicesSection.sendEBP.NAME
                }
                options={
                  onboardingFormMetaData.employeeServicesSection.sendEBP.OPTIONS
                }
              />
            </div>
          </div>
        </>
      )}
      {getValues(workingRights) !== current && (
        <>
          <div className="form-group">
            <div className={"form-group__label-group"}></div>
            <div className={"form-group__input-group"}>
              <EEFormCheckbox
                id={
                  onboardingFormMetaData.employeeServicesSection.awaitingVisa
                    .NAME
                }
                name={
                  onboardingFormMetaData.employeeServicesSection.awaitingVisa
                    .NAME
                }
                options={
                  onboardingFormMetaData.employeeServicesSection.awaitingVisa
                    .OPTIONS
                }
              />
            </div>
          </div>
        </>
      )}
      <Separator />
      <div className="form-group">
        <div
          className={
            "form-group__input-group flex-inline-start margin-left-3rem"
          }
        >
          <ButtonRow>
            <div style={{ display: hidePreviewButton ? "none" : "block" }}>
              <Button
                tone="neutral"
                onClick={() => {
                  onPreview(getValues());
                }}
              >
                Preview
              </Button>
            </div>
            <div
              style={{ display: hideRequestUpdateButton ? "none" : "block" }}
            >
              <Button tone="success" onClick={showOrHideRequestUpdateModal}>
                tone="neutral" Request Update
              </Button>
            </div>
            <div
              style={{ display: hideSaveAndUpdateButton ? "none" : "block" }}
            >
              <Button
                tone="success"
                onClick={handleSaveAndUpdate(() => {
                  onSaveAndUpdate(getValues());
                })}
              >
                Save & Update
              </Button>
            </div>
            <div
              style={{ display: hideSaveAndApproveButton ? "none" : "block" }}
            >
              <Button
                tone="success"
                onClick={handleSaveAndApprove(() => {
                  onSaveAndApprove(getValues());
                })}
              >
                Save & Approve
              </Button>
            </div>
            <div style={{ display: hideSkipButton ? "none" : "block" }}>
              <Button
                tone="success"
                onClick={handleSkipContract(() => {
                  onSkipContract(getValues());
                })}
              >
                Skip Contract
              </Button>
            </div>
            <div style={{ display: hideSkipButton ? "none" : "block" }}>
              <Button
                tone="success"
                onClick={handleSkipForm(() => {
                  onSkipContractAndForms(getValues());
                })}
              >
                Skip Contract and Employment Form
              </Button>
            </div>
            <div style={{ display: hideReopenButton ? "none" : "block" }}>
              <Button
                tone="success"
                onClick={handleReopen(() => {
                  onReopen();
                })}
              >
                Reopen Form
              </Button>
            </div>
            <div
              style={{ display: hideCancelOnboardingButton ? "none" : "block" }}
            >
              <Button
                type="danger"
                onClick={handleCancel(() => {
                  onCancel();
                })}
                disabled={cannotCancel}
              >
                Cancel Onboarding
              </Button>
            </div>
          </ButtonRow>
        </div>
      </div>
      {showCancelConfirmation && (
        <Modal title="Confirm cancellation" onCancel={showOrHideCancelModal}>
          <Modal.Body>
            <textarea
              name="hiddenLabel"
              rows="4"
              className="form-control textarea--resize-both"
              placeholder="Please enter a cancellation reason"
              value={cancelReason || ""}
              onChange={event => {
                setCancelReason(event.target.value);
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button tone="neutral" onClick={showOrHideCancelModal}>
              Cancel
            </Button>
            <Button
              tone="success"
              disabled={cancelReason.length <= 0}
              onClick={cancelForm}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {showUpdateRequestModal && (
        <Modal
          title="Update Request Reason"
          onCancel={showOrHideRequestUpdateModal}
        >
          <Modal.Body>
            <textarea
              name="hiddenLabel"
              rows="4"
              className="form-control textarea--resize-both"
              placeholder="Please enter reason for requesting update"
              value={updateRequestReason || ""}
              onChange={event => {
                setUpdateRequestReason(event.target.value);
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button tone="neutral" onClick={showOrHideRequestUpdateModal}>
              Cancel
            </Button>
            <Button
              tone="success"
              disabled={updateRequestReason.length <= 0}
              onClick={handleRequestUpdate}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </FormHorizontal>
  );
};

export default EmployeeServicesSection;
