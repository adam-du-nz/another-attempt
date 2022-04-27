import { Input } from "@myob/myob-widgets";
import FormAlert from "../../common/FormAlert";
import React from "react";
import { intersection } from "ramda";
import { useLocation } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import Card from "../../common/Card";
import { EEFormSearch } from "../../common/form-fields";
import { roleUpdateMetaData } from "./roleUpdateMetaData";
import { isNotNilEmpty } from "../../../utils";

export default function EmployeeName({ users }) {
  const { getValues } = useFormContext();
  const location = useLocation();
  const currentPathname = location?.pathname.toLowerCase();
  const isEditOrPreviewMode = isNotNilEmpty(
    intersection(currentPathname, ["edit", "preview"])
  );

  const fields = [
    { name: "positionTitle", label: "Position Title" },
    { name: "employmentType", label: "Employment Type" },
    { name: "function", label: "Function" },
    { name: "group", label: "Group" },
    { name: "department", label: "Department" },
    { name: "team", label: "Team" },
    { name: "vertical", label: "Vertical" },
    { name: "segment", label: "Segment" },
    { name: "managerFullName", label: "Manager's Name" },
    { name: "teamMemberLevel", label: "Team Member Level" },
    { name: "locationOffice", label: "Office Location" }
  ];

  const getFieldValue = fieldName => {
    const person = getValues("employee");
    if (fieldName === "employmentType") {
      return getFriendlyEmploymentType(person);
    }
    return person[fieldName];
  };

  const getFriendlyEmploymentType = person => {
    switch (person.employmentType) {
      case "FT":
        return "Full Time";
      case "PT":
        return "Part Time";
      case "FT.FIXED":
      case "PT.FIXED":
        return "Fixed Term";
      case "COA":
        return "Contractor";
      case "SEC - FT":
        return "Secondment - Full Time";
      case "SEC - PT":
        return "Secondment - Part Time";
      case "CAS":
        return "Casual";
      case "MAT":
        return "Parental Leave";
      default:
        return "";
    }
  };

  const metaData = [
    { columnName: "userFullName", columnWidth: "150px", showData: true },
    { columnName: "userPrincipalName", columnWidth: "243px", align: "right" }
  ];

  const employee = getValues("employee");
  return (
    <Card
      title={"Current Employee Details"}
      body={
        <>
          <EEFormSearch
            name={roleUpdateMetaData.employeeDetails.employeeName.NAME}
            label={roleUpdateMetaData.employeeDetails.employeeName.LABEL}
            items={users}
            metaData={metaData}
            sealed={isEditOrPreviewMode}
          />
          {employee &&
            fields.map(field => (
              <Input
                key={field.name}
                name={field.name}
                label={field.label}
                value={getFieldValue(field.name)}
                disabled
              />
            ))}
          {employee && employee.employmentType === "COA" && (
            <FormAlert
              alertMessage="This individual is a 3rd party contractor and not currently paid by MYOB"
              alertType="info"
            />
          )}
        </>
      }
    />
  );
}
