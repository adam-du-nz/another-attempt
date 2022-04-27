import { HelpIcon, Popover } from "@myob/myob-widgets";
import React from "react";
import { commonMetaData } from "./commonMetaData";

import { EEFormSelect } from "./form-fields";

export default function TeamMemberLevel() {
  const Description = () => (
    <>
      <h3>Team Member Level Descriptions</h3>
      <p>
        <b>Team Member:</b>
      </p>
      <p>
        All MYOB employees who are not part of People Leader, SLT or ELT groups.
      </p>
      <p>
        <b>People Leader:</b>
      </p>
      <p>
        Any MYOB employees that have team members reporting directly to them.
      </p>
      <p>
        <b>SLT:</b>
      </p>
      <p>
        MYOB employees who are part of the Senior Leadership Team. These
        employees usually report directly to the ELT.
      </p>
      <p>
        <b>ELT:</b>
      </p>
      <p>
        MYOB employees who are part of the Executive Leadership Team. These
        employees usually report directly to the CEO.
      </p>
    </>
  );

  return (
    <>
      <EEFormSelect
        name={commonMetaData.teamMemberLevel.NAME}
        label={commonMetaData.teamMemberLevel.LABEL}
        options={commonMetaData.teamMemberLevel.OPTIONS}
        placeholder={"Select Team Member Level"}
        popover={
          <Popover
            body={<Popover.Body child={<Description />} preferPlace="right" />}
          >
            <HelpIcon />
          </Popover>
        }
      />
    </>
  );
}
