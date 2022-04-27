import React from "react";
import { FormHorizontal } from "@myob/myob-widgets";
import { commonMetaData } from "./commonMetaData";
import { EEFormTextArea } from "./form-fields";

const CancelReason = () => {
  return (
    <FormHorizontal>
      <EEFormTextArea
        name={commonMetaData.cancelReason.NAME}
        label={commonMetaData.cancelReason.LABEL}
        disabled={true}
      ></EEFormTextArea>
    </FormHorizontal>
  );
};

export default CancelReason;
