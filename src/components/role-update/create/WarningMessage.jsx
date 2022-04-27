import React from "react";
import { Alert } from "@myob/myob-widgets";

export default function WarningMessage() {
  return (
    <>
      <div>
        <Alert type="warning">
          <p>
            To help you to be a super organised People Leader and ensure a great
            experience for your team member, here’s a couple of key things
            you’ll want to consider:
          </p>
          <p>
            <ul>
              <li>
                Once you click "submit" on this form the magic of tech means the
                paperwork will go straight to your team member. So make sure
                you've chatted with them first and they know to expect it!
              </li>
              <li>
                You'll also need to ensure you've dotted your I's and crossed
                your T's by having the appropriate approvals in place before you
                submit this form. No approval = no form!
              </li>
            </ul>
          </p>
          <p>
            Click{" "}
            <a
              href="https://helpme.myob.com/hc/en-us/articles/360001287227-Internal-Transfers-Promotions-Secondments"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>{" "}
            for further help.
          </p>
          <p></p>
        </Alert>
      </div>
    </>
  );
}
