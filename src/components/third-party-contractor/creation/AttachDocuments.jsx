import React from "react";
import { EEFormDropZone } from "../../common/form-fields";
export default function AttachDocuments() {
  return (
    <>
      <div>
        <ul>
          <span>
            You may need to complete, scan and attach the following to this
            form:
          </span>
          <li className="margin-left-1rem">
            3rd Party Acceptance Form (signed by the Contractor)
          </li>
          <li className="margin-left-1rem">
            Risk Exemption Form (if the contractor is using their own hardware
            to access the MYOB network)
          </li>
          <span>Please upload any documents that apply:</span>
        </ul>
      </div>
      <EEFormDropZone name={"attachments"} />
    </>
  );
}
