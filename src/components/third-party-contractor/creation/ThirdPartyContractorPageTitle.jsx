import React from "react";
import { PageHead } from "@myob/myob-widgets";

export default function ThirdPartyContractorPageTitle() {
  return (
    <>
      <PageHead title="Third Party Contractor Form" />
      <div>
        <p>
          <strong>Complete this form for ALL Third Party Contractors</strong>
        </p>
        <p>
          <strong>
            Before you begin{" "}
            <span style={{ textDecoration: "underline" }}>
              please read the following Step by Step Guide
            </span>{" "}
            for the quickest and easiest way to bring on your Third Party
            Contractor:{" "}
          </strong>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://helpme.myob.com/hc/en-us/articles/360033805193-Third-Party-Contractor-Access-and-Onboarding"
          >
            Third Party Contractor – Access & Onboarding
          </a>
        </p>
        <p>
          You must have a current Consultancy or Enterprise level Agreement in
          place before you submit this form
        </p>
        <p>
          <strong>You may need to attach the following to this form: </strong>
        </p>
        <ul className="margin-left-1rem">
          <li>
            Signed{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://helpme.myob.com/hc/article_attachments/4405756321177/MYOB_3rd_Party_Security_Acceptance_Form_-_Aug_2021.docx"
            >
              3rd Party Acceptance Form
            </a>{" "}
            (signed by the Contractor)
            <ul className="margin-left-1rem">
              <li>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://myobo365.sharepoint.com/sites/IQMS/Shared%20Documents/Policies%20and%20Documentation/All%20MYOB%20Standards%20-%20Published/MYOB%20Acceptable%20Usage%20Standard.pdf"
                >
                  Acceptable Usage Standard
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://myobo365.sharepoint.com/sites/IQMS/Shared%20Documents/Policies%20and%20Documentation/All%20MYOB%20Standards%20-%20Published/MYOB%20Information%20Security%20Policy.pdf"
                >
                  Information Security Policy
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://helpme.myob.com/hc/article_attachments/360043620193/MYOB_Risk_Exemption___Acceptance_Form_v1.5_-_NonStandard_Devices__3_.docx"
            >
              Risk Exemption Form
            </a>{" "}
            (if the contractor is using their own hardware to access the MYOB
            network)
          </li>
        </ul>
      </div>
    </>
  );
}
