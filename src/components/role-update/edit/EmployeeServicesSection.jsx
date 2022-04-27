import HttpStatus from "http-status-codes";
import React, { useEffect, useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ButtonRow, Button, FormHorizontal, Modal } from "@myob/myob-widgets";
import { EEFormInput } from "./../../common/form-fields";
import RoleUpdateFormFrontendDto from "../dto/RoleUpdateFormFrontendDto";
import { getWebMergeContractPreview } from "../../../apis/awsApis";
import {
  getRoleUpdateFormById,
  reopenRoleUpdateForm,
  skipRoleUpdateContract,
  cancelRoleUpdateForm,
  skipRoleUpdateContractAndEmploymentForms,
  updateRoleUpdateForm
} from "../../../apis/kilnBackendApis";
import { sanitiseFormData, calculateProbationPeriod } from "../../../utils/";
import { commonMetaData } from "../../common/commonMetaData";

const EmployeeServicesSection = props => {
  const { getValues, reset } = useFormContext();
  const history = useNavigate();

  const {
    formId,
    handleSubmitFunc,
    loadingCallback,
    changeDescription,
    showPreviewButton,
    showSaveAndUpdateButton,
    showSaveAndApproveButton,
    showSkipContractButton,
    showSkipContractAndFormsButton,
    showCancelButton,
    showReopenButton,
    cancelButtonText,
    // showProbationPeriod,
    probationPeriodProps: {
      shouldDisplay: showProbationPeriod,
      fixedTermStartDate,
      fixedTermEndDate
    }
  } = props;
  const {
    handleSaveAndUpdate,
    handleSaveAndApprove,
    handleCancel,
    handleReopen,
    handleSkipContract,
    handleSkipForm
  } = handleSubmitFunc;

  const [hideSaveAndUpdateButton, setHideSaveAndUpdateButton] = useState(true);
  const [hidePreviewButton, setHidePreviewButton] = useState(true);
  const [hideSaveAndApproveButton, setHideSaveAndApproveButton] =
    useState(true);
  const [hideSkipButton, setHideSkipButton] = useState(true);
  const [hideSkipContractAndFormsButton, setHideSkipContractAndFormsButton] =
    useState(true);
  const [hideReopenButton, setHideReopenButton] = useState(true);
  const [hideCancelRoleUpdateButton, setHideCancelRoleUpdateButton] =
    useState(true);

  useEffect(() => {
    const renderEsButtons = () => {
      setHideSaveAndUpdateButton(!showSaveAndUpdateButton);
      setHidePreviewButton(!showPreviewButton);
      setHideSaveAndApproveButton(!showSaveAndApproveButton);
      setHideSkipButton(!showSkipContractButton);
      setHideSkipContractAndFormsButton(!showSkipContractAndFormsButton);
      setHideReopenButton(!showReopenButton);
      setHideCancelRoleUpdateButton(!showCancelButton);
    };
    renderEsButtons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    showPreviewButton,
    showSaveAndUpdateButton,
    showSaveAndApproveButton,
    showSkipContractButton,
    showSkipContractAndFormsButton,
    showCancelButton,
    showReopenButton
  ]);

  const submit = async data => {
    loadingCallback(true);
    try {
      const res = await updateRoleUpdateForm(formId, data);
      loadingCallback(false);
      if (
        res.status === HttpStatus.NO_CONTENT ||
        res.status === HttpStatus.OK
      ) {
        return history("/success", {
          messages: ["Role update form has been successfully updated."],
          button: {
            clickUrl: "/form/role-update/list"
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
    changeDescription("Role Update form is updating");
    const formattedData = sanitiseFormData(data);
    const afterApprovalData = {
      ...formattedData,
      evaluationStatus: "UNEVALUATED",
      isUpdate: true
    };
    submit(afterApprovalData);
  };

  const onSaveAndApprove = data => {
    changeDescription("Role Update form is approving");
    const formattedData = sanitiseFormData(data);
    const afterApprovalData = {
      ...formattedData,
      evaluationStatus: "APPROVED",
      isUpdate: false
    };
    submit(afterApprovalData);
  };

  const onReopen = async () => {
    changeDescription("Role update form is re-opening");
    loadingCallback(true);
    try {
      const res = await reopenRoleUpdateForm(formId);
      loadingCallback(false);
      if (res.status === HttpStatus.NO_CONTENT) {
        window.location.reload();
        return history(`/form/role-update/${formId}/edit`);
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
    changeDescription("Skipping contract for role-update form");
    loadingCallback(true);
    try {
      const formattedData = sanitiseFormData(data);
      const skipContractData = {
        ...formattedData,
        evaluationStatus: "CONTRACT_SKIPPED"
      };
      const res = await skipRoleUpdateContract(formId, skipContractData);
      loadingCallback(false);
      if (res.status === HttpStatus.NO_CONTENT) {
        return history("/success", {
          messages: ["Contract has been successfully skipped."],
          button: {
            clickUrl: "/form/role-update/list"
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
      "Skipping contract and employment forms for role-update form"
    );
    loadingCallback(true);
    try {
      const formattedData = sanitiseFormData(data);
      const status = "ALL_SKIPPED";
      const skipData = {
        ...formattedData,
        evaluationStatus: status
      };
      const res = await skipRoleUpdateContractAndEmploymentForms(
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
            clickUrl: "/form/role-update/list"
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
      changeDescription("Cancelling role update form");
      loadingCallback(true);
      const res = await cancelRoleUpdateForm(formId, cancelReason);
      loadingCallback(false);
      if (res.status === HttpStatus.NO_CONTENT) {
        return history("/success", {
          messages: ["Role update form has been cancelled successfully."],
          button: {
            clickUrl: "/form/role-update/list"
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

  const probationPeriod = useMemo(
    () => calculateProbationPeriod(fixedTermStartDate, fixedTermEndDate),
    [fixedTermStartDate, fixedTermEndDate]
  );

  const fetchFormData = async formId => {
    const response = await getRoleUpdateFormById(formId);
    if (response.status !== HttpStatus.OK) {
      return history("/error", {
        messages: [response.data.message]
      });
    }
    const roleUpdateDto = RoleUpdateFormFrontendDto.create(response.data);
    reset(roleUpdateDto);
  };

  /**
   * Generates a preview of the contract and downloads it.
   */
  const handlePreview = async data => {
    changeDescription("Generating contract preview");
    loadingCallback(true);
    // save the form first so the preview shows the data the user
    // currently has in front of them
    const formattedData = sanitiseFormData(data);
    const status = "UNEVALUATED";
    const updateData = {
      ...formattedData,
      evaluationStatus: status,
      isUpdate: true
    };
    try {
      const res = await updateRoleUpdateForm(formId, updateData);
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
      formType: "ROLE_UPDATE"
    });
    const file = new Blob([result.data], { type: "application/pdf" });
    const fileUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", `contract-preview-${formId}.pdf`);
    loadingCallback(false);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <FormHorizontal>
      {showProbationPeriod && (
        <EEFormInput
          id={commonMetaData.probationPeriod.NAME}
          name={commonMetaData.probationPeriod.NAME}
          label={commonMetaData.probationPeriod.LABEL}
          value={probationPeriod}
          disabled
        />
      )}
      <div className="form-group">
        <div
          className={
            "form-group__input-group flex-inline-start margin-left-3rem"
          }
        >
          <ButtonRow>
            <div style={{ display: hidePreviewButton ? "none" : "block" }}>
              <Button
                type="secondary"
                onClick={() => {
                  handlePreview(getValues());
                }}
              >
                Preview
              </Button>
            </div>
            <div
              style={{ display: hideSaveAndUpdateButton ? "none" : "block" }}
            >
              <Button
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
                onClick={handleSaveAndApprove(() => {
                  onSaveAndApprove(getValues());
                })}
              >
                Save & Approve
              </Button>
            </div>
            <div style={{ display: hideSkipButton ? "none" : "block" }}>
              <Button
                onClick={handleSkipContract(() => {
                  onSkipContract(getValues());
                })}
              >
                Skip Contract
              </Button>
            </div>
            <div
              style={{
                display: hideSkipContractAndFormsButton ? "none" : "block"
              }}
            >
              <Button
                onClick={handleSkipForm(() => {
                  onSkipContractAndForms(getValues());
                })}
              >
                Skip Contract and Employment Forms
              </Button>
            </div>
            <div style={{ display: hideReopenButton ? "none" : "block" }}>
              <Button
                onClick={handleReopen(() => {
                  onReopen();
                })}
              >
                Reopen Form
              </Button>
            </div>
            <div
              style={{ display: hideCancelRoleUpdateButton ? "none" : "block" }}
            >
              <Button
                type="delete"
                onClick={handleCancel(() => {
                  onCancel();
                })}
              >
                {cancelButtonText}
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
    </FormHorizontal>
  );
};

export default EmployeeServicesSection;
