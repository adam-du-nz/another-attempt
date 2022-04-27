import { useFormContext } from "react-hook-form";
import Card from "../../common/Card";
import React from "react";
import { EEFormTextArea } from "../../common/form-fields";

import EEFormDropZone from "../../common/form-fields/EEFormDropZone";

const ParentalLeaveAttachment = () => {
  const { getValues } = useFormContext();

  const type = getValues().typeOfParentalLeave;
  const isSharingPrimaryCarerLeave = type === "Sharing Primary Carer Leave";
  const isOtherParentalLeave = [
    "Primary Carer Leave",
    "Secondary Carer Leave",
    "Surrogacy Leave"
  ].includes(type);

  return (
    <>
      <Card
        title={"Attachments"}
        body={
          <>
            {isSharingPrimaryCarerLeave && (
              <span>
                Please upload a certificate from the midwife or doctor
                confirming you, or your partner's pregnancy and due date AND a
                statutory declaration stating the period that you will be the
                primary carer for the child in the attachments section below.
              </span>
            )}
            {isOtherParentalLeave && (
              <span>
                Please upload a certificate from your midwife or doctor
                confirming your pregnancy and due date in the attachments
                section below.
              </span>
            )}
            <p>Please upload all relevant documents here:</p>
            <EEFormDropZone name="attachments" />
            <div className="mainContainer">
              <EEFormTextArea
                name="comments"
                label="Additional Comments"
              ></EEFormTextArea>
            </div>
          </>
        }
      />
    </>
  );
};

export default ParentalLeaveAttachment;
