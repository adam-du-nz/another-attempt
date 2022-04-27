import React from "react";
import EEFormSelect from "../../common/form-fields/EEFormSelect";

const options = [
  { value: "Resignation", label: "Resignation" },
  { value: "Dismissal", label: "Dismissal" },
  {
    value: "End of contract (fixed-term, casual or 3rd party)",
    label: "End of contract (fixed-term, casual or 3rd party)"
  },
  { value: "Redundancy", label: "Redundancy" },
  { value: "Did not start", label: "Did not start" },
  { value: "Retirement", label: "Retirement" },
  { value: "Abandonment", label: "Abandonment" },
  { value: "Deceased", label: "Deceased" },
  { value: "Other", label: "Other" }
];
options.sort((a, b) => a.value.localeCompare(b.value));
const DepartureReasonSelect = props => {
  return <EEFormSelect {...props} options={options} />;
};

export default DepartureReasonSelect;
