import React from "react";
import EEFormSelect from "../../common/form-fields/EEFormSelect";

const options = [
  { value: "Regrettable", label: "Regrettable" },
  { value: "Not Regrettable", label: "Not Regrettable" }
];
const ImpactOfDepartureSelect = props => {
  return <EEFormSelect {...props} options={options} />;
};

export default ImpactOfDepartureSelect;
