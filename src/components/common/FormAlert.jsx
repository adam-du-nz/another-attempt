import { Alert, Field } from "@myob/myob-widgets";
import PropTypes from "prop-types";
import React from "react";
import { useMarked } from "../../utils/hooks/useMarked";

/**
 * Assign the instance to a form alert,
 * @param {string} alert.alertMessage - the message string. Markdown syntax supported.
 * @param {string} alert.alertType - the type of the alert: success, info, warning, danger or brand.
 * @returns {Field} - a Feelix Field wrapped Alert component
 */
const FormAlert = ({ alertMessage, alertType }) => {
  const processedAlertMessage = useMarked(alertMessage);
  return (
    <>
      <Field
        label=""
        hideLabel
        renderField={() => (
          <Alert tone={alertType} hideLabel>
            <p dangerouslySetInnerHTML={{ __html: processedAlertMessage }}></p>
          </Alert>
        )}
      />
    </>
  );
};
FormAlert.prototype = {
  alertType: PropTypes.oneOf(["success", "info", "warning", "danger", "brand"]),
  alertMessage: PropTypes.string
};

export default FormAlert;
