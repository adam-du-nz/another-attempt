import React from "react";
import { useFormContext } from "react-hook-form";

import { roleUpdateMetaData } from "./roleUpdateMetaData";
import {
  EEFormCheckbox,
  EEFormSearch,
  EEFormTextArea
} from "../../common/form-fields";
import PositionOrganisationDetails from "./PositionOrganisationDetails";

export default function ReportingLineChange({ users }) {
  const { getValues } = useFormContext();
  const manager = getValues(
    roleUpdateMetaData.newPosition.newDirectManager.NAME
  );

  return (
    <>
      <EEFormSearch
        name={roleUpdateMetaData.newPosition.newDirectManager.NAME}
        label={roleUpdateMetaData.newPosition.newDirectManager.LABEL}
        items={users}
        metaData={[
          {
            columnName: "fullName",
            columnWidth: "150px",
            showData: true
          },
          {
            columnName: "userPrincipalName",
            columnWidth: "243px",
            align: "right"
          }
        ]}
      ></EEFormSearch>
      <PositionOrganisationDetails manager={manager} />
      <EEFormCheckbox
        name={roleUpdateMetaData.newPosition.updateArchieReportingLine.NAME}
        label={roleUpdateMetaData.newPosition.updateArchieReportingLine.LABEL}
        options={
          roleUpdateMetaData.newPosition.updateArchieReportingLine.OPTIONS
        }
      ></EEFormCheckbox>
      <EEFormTextArea
        name={roleUpdateMetaData.newPosition.additionalComments.NAME}
        label={roleUpdateMetaData.newPosition.additionalComments.LABEL}
      ></EEFormTextArea>
    </>
  );
}
