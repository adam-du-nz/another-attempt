import React from "react";
import { useFormContext } from "react-hook-form";
import EmployeeOrganisationSelect from "./employee-organisation/EmployeeOrganisationSelect";
import { EEFormCheckbox, EEFormSelect } from "./form-fields";
import { commonMetaData } from "./commonMetaData";
import { isIncluded } from "../../utils";

export default function PhoneSystems({ employees }) {
  const { getValues } = useFormContext();

  return (
    <>
      <EEFormCheckbox
        name={commonMetaData.phoneSystems.isGenesysRequired.NAME}
        label={commonMetaData.phoneSystems.isGenesysRequired.LABEL}
        options={commonMetaData.phoneSystems.isGenesysRequired.OPTIONS}
      ></EEFormCheckbox>
      {isIncluded(
        getValues(commonMetaData.phoneSystems.isGenesysRequired.NAME),
        commonMetaData.phoneSystems.isGenesysRequired.OPTIONS[0].name
      ) && (
        <>
          <EmployeeOrganisationSelect
            name={commonMetaData.phoneSystems.genesysAccessBasedOn.NAME}
            label={commonMetaData.phoneSystems.genesysAccessBasedOn.LABEL}
            items={employees}
          />
          <EEFormSelect
            name={commonMetaData.phoneSystems.genesysAgentGroup.NAME}
            label={commonMetaData.phoneSystems.genesysAgentGroup.LABEL}
            placeholder={
              commonMetaData.phoneSystems.genesysAgentGroup.PLACEHOLDER
            }
            options={commonMetaData.phoneSystems.genesysAgentGroup.OPTIONS}
          ></EEFormSelect>
        </>
      )}
      <EEFormCheckbox
        name={commonMetaData.phoneSystems.teamsDirectNumber.NAME}
        label={commonMetaData.phoneSystems.teamsDirectNumber.LABEL}
        options={commonMetaData.phoneSystems.teamsDirectNumber.OPTIONS}
      ></EEFormCheckbox>
    </>
  );
}
