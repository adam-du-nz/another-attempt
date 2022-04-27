import React from "react";
import EEFormInput from "../form-fields/EEFormInput";

const EmployeeOrganisationDetails = ({ children }) => {
  return (
    <>
      {children}
      <EEFormInput
        name={"positionTitle"}
        label={"Position title"}
        disabled={true}
      />
      <EEFormInput name={"function"} label={"Function"} disabled={true} />
      <EEFormInput name={"group"} label={"Group"} disabled={true} />
      <EEFormInput name={"department"} label={"Department"} disabled={true} />
      <EEFormInput name={"team"} label={"Team"} disabled={true} />
      <EEFormInput name={"vertical"} label={"Vertical"} disabled={true} />
      <EEFormInput name={"location"} label={"Location"} disabled={true} />
    </>
  );
};

export default EmployeeOrganisationDetails;
