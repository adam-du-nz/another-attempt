import React from "react";
import { useFormContext } from "react-hook-form";

import { EEFormSearch } from "../form-fields";

const EmployeeOrganisationSelect = props => {
  const { formState: { errors } } = useFormContext();
  const errorMessage = errors[props.name]?.message;
  return (
    <EEFormSearch
      {...props}
      metaData={[
        { columnName: "fullName", columnWidth: "70px", showData: true },
        { columnName: "email", columnWidth: "120px" }
      ]}
      hintText={"Select an option"}
      errorMessage={errorMessage}
    />
  );
};

export default EmployeeOrganisationSelect;
