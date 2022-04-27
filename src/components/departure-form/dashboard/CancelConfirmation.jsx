import React, { useState } from "react";
import { Modal, Button } from "@myob/myob-widgets";
import { useNavigate } from "react-router-dom";
import { cancelDepartureForm } from "../../../apis/kilnBackendApis";
import HttpStatus from "http-status-codes";

const CancelConfirmation = ({ formId, onCancelDeparture }) => {
  const [cancelReason, setCancelReason] = useState("");
  const [showDoubleConfirm, setShowDoubleConfirm] = useState(false);
  const [showCancelReason, setShowCancelReason] = useState(true);
  const history = useNavigate();

  const submitCancellation = async () => {
    setShowDoubleConfirm(false);
    setShowCancelReason(false);
    try {
      const res = await cancelDepartureForm(formId, cancelReason);
      if (res.status === HttpStatus.NO_CONTENT) {
        return history("/success", {
          messages: ["Departure form has been cancelled successfully."],
          button: {
            clickUrl: "/form/departure/list"
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

  return (
    <>
      {showCancelReason && (
        <Modal title="Cancel Reason" onCancel={onCancelDeparture}>
          <Modal.Body>
            <textarea
              name="hiddenLabel"
              rows="4"
              className="form-control textarea--resize-both"
              placeholder="Please enter cancel reason"
              maxLength="500"
              value={cancelReason || ""}
              onChange={event => {
                setCancelReason(event.target.value);
              }}
            />
            <p>{cancelReason.length}/500</p>
          </Modal.Body>
          <Modal.Footer>
            <Button tone="neutral" onClick={onCancelDeparture}>
              Cancel
            </Button>
            <Button
              tone="success"
              disabled={cancelReason.length <= 0}
              onClick={() => setShowDoubleConfirm(true)}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {showDoubleConfirm && (
        <Modal
          size="small"
          title="Submit Cancellation"
          onCancel={() => setShowDoubleConfirm(false)}
        >
          <Modal.Body>
            <p>Do you really want to cancel the Departure Form?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button tone="neutral" onClick={() => setShowDoubleConfirm(false)}>
              Cancel
            </Button>
            <Button tone="success" onClick={submitCancellation}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default CancelConfirmation;
