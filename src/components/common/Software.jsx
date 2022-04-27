import React from "react";
import { useFormContext } from "react-hook-form";
import {
  EEFormCheckbox,
  EEFormInput,
  EEFormTextArea,
  EEFormRadioButtons
} from "./form-fields";
import { commonMetaData } from "./commonMetaData";
import FormAlert from "./FormAlert";
import EmployeeOrganisationSelect from "./employee-organisation/EmployeeOrganisationSelect";
import { isIncluded } from "../../utils";
import { pluck, values } from "ramda";

export default function Software({ employees }) {
  const { getValues, setValue, watch } = useFormContext();

  const toWatch = pluck("NAME", values(commonMetaData.software));
  watch(toWatch);

  const onTeamviewerLicenseTypeChange = ({ value }) => {
    setValue(commonMetaData.software.teamviewerLicenseType.NAME, value);
  };

  const onTableauAccessTypeChange = ({ value }) => {
    setValue(commonMetaData.software.tableauAccessType.NAME, value);
  };

  return (
    <>
      <EEFormCheckbox
        name={commonMetaData.software.software.NAME}
        label={commonMetaData.software.software.LABEL}
        options={commonMetaData.software.software.OPTIONS}
      ></EEFormCheckbox>
      {isIncluded(
        getValues(commonMetaData.software.software.NAME),
        commonMetaData.software.software.OPTIONS[0].name
      ) && (
        <>
          <EmployeeOrganisationSelect
            name={commonMetaData.software.archieAccessBasedOn.NAME}
            label={commonMetaData.software.archieAccessBasedOn.LABEL}
            items={employees}
          />
          <EmployeeOrganisationSelect
            name={commonMetaData.software.reportingLineManager.NAME}
            label={commonMetaData.software.reportingLineManager.LABEL}
            items={employees}
          />
          <EEFormCheckbox
            name={commonMetaData.software.countryAccess.NAME}
            label={commonMetaData.software.countryAccess.LABEL}
            options={commonMetaData.software.countryAccess.OPTIONS}
          ></EEFormCheckbox>
          <EEFormCheckbox
            name={commonMetaData.software.thisEmployeeIsAManagerInArchie.NAME}
            label={commonMetaData.software.thisEmployeeIsAManagerInArchie.LABEL}
            options={
              commonMetaData.software.thisEmployeeIsAManagerInArchie.OPTIONS
            }
          ></EEFormCheckbox>
          <EEFormTextArea
            name={commonMetaData.software.archieTextBox.NAME}
            label={commonMetaData.software.archieTextBox.LABEL}
          ></EEFormTextArea>
        </>
      )}
      {isIncluded(
        getValues(commonMetaData.software.software.NAME),
        commonMetaData.software.software.OPTIONS[1].name
      ) && (
        <>
          <EmployeeOrganisationSelect
            name={commonMetaData.software.archieAnalyticsAccessBasedOn.NAME}
            label={commonMetaData.software.archieAnalyticsAccessBasedOn.LABEL}
            items={employees}
          />
        </>
      )}
      {isIncluded(
        getValues(commonMetaData.software.software.NAME),
        commonMetaData.software.software.OPTIONS[2].name
      ) && (
        <>
          <EmployeeOrganisationSelect
            name={commonMetaData.software.banklinkAccessBasedOn.NAME}
            label={commonMetaData.software.banklinkAccessBasedOn.LABEL}
            items={employees}
          />
          <EEFormCheckbox
            name={commonMetaData.software.banklinkAccessRequired.NAME}
            label={commonMetaData.software.banklinkAccessRequired.LABEL}
            options={commonMetaData.software.banklinkAccessRequired.OPTIONS}
          ></EEFormCheckbox>
        </>
      )}
      {isIncluded(
        getValues(commonMetaData.software.software.NAME),
        commonMetaData.software.software.OPTIONS[12].name
      ) && (
        <>
          <EEFormCheckbox
            name={commonMetaData.software.salesforceProvision.NAME}
            label={commonMetaData.software.salesforceProvision.LABEL}
            options={commonMetaData.software.salesforceProvision.OPTIONS}
          ></EEFormCheckbox>
        </>
      )}
      {isIncluded(
        getValues(commonMetaData.software.software.NAME),
        commonMetaData.software.software.OPTIONS[13].name
      ) && (
        <EEFormRadioButtons
          name={commonMetaData.software.tableauAccessType.NAME}
          label={commonMetaData.software.tableauAccessType.LABEL}
          options={commonMetaData.software.tableauAccessType.OPTIONS}
          onChange={onTableauAccessTypeChange}
          defaultValue={"Viewer"}
          defaultChecked={"Viewer"}
        ></EEFormRadioButtons>
      )}
      {isIncluded(
        getValues(commonMetaData.software.software.NAME),
        commonMetaData.software.software.OPTIONS[14].name
      ) && (
        <EEFormRadioButtons
          name={commonMetaData.software.teamviewerLicenseType.NAME}
          label={commonMetaData.software.teamviewerLicenseType.LABEL}
          options={commonMetaData.software.teamviewerLicenseType.OPTIONS}
          onChange={onTeamviewerLicenseTypeChange}
          defaultValue={
            "TeamViewer Lite - Up to 19 connections per month ($1000)"
          }
          defaultChecked={
            "TeamViewer Lite - Up to 19 connections per month ($1000)"
          }
        ></EEFormRadioButtons>
      )}
      {isIncluded(
        getValues(commonMetaData.software.software.NAME),
        commonMetaData.software.software.OPTIONS[16].name
      ) && (
        <>
          <EEFormCheckbox
            name={commonMetaData.software.zendeskInstance.NAME}
            label={commonMetaData.software.zendeskInstance.LABEL}
            options={commonMetaData.software.zendeskInstance.OPTIONS}
          ></EEFormCheckbox>
          <EEFormInput
            name={commonMetaData.software.zendeskQueue.NAME}
            label={commonMetaData.software.zendeskQueue.LABEL}
          ></EEFormInput>
        </>
      )}
      {isIncluded(
        getValues(commonMetaData.software.software.NAME),
        commonMetaData.software.software.OPTIONS[17].name
      ) && (
        <>
          <FormAlert
            alertMessage="Please check that the software you're after isn't in the list of available [pre-packaged software](https://helpme.myob.com/hc/en-us/articles/115008325307-How-to-install-software-on-your-Windows-PC-or-Mac') on your computer."
            alertType="info"
          ></FormAlert>
          <EEFormTextArea
            name={commonMetaData.software.otherSoftware.NAME}
            label={commonMetaData.software.otherSoftware.LABEL}
          ></EEFormTextArea>
        </>
      )}
    </>
  );
}
