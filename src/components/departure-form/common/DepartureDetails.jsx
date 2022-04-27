import React, { useContext, useState, useEffect } from "react";
import EEFormFileInput from "../../common/form-fields/EEFormFileInput";
import EEFormDatePicker from "../../common/form-fields/EEFormDatePicker";
import EEFormTextArea from "../../common/form-fields/EEFormTextArea";
import DepartureReasonSelect from "./DepartureReasonSelect";
import { useFormContext } from "react-hook-form";
import { getDownloadLink } from "../../../apis/kilnBackendApis";
import { StatusContext } from "../../../entities/StatusContext";
import { isEmpty, isNil } from "ramda";

const DepartureDetails = ({
  children,
  onLastDayInTheOfficeChange,
  resignationLetter
}) => {
  const { getValues } = useFormContext();
  const [status] = useContext(StatusContext);
  const [fileDownloadLink, setFileDownloadLink] = useState(undefined);
  const displayResignationLetterAttachment = () => {
    return ["Resignation", "Retirement"].find(
      value => value === getValues("departureReason")
    );
  };
  const fileBrowser = () =>
    displayResignationLetterAttachment() && (
      <EEFormFileInput
        name={"resignationLetter"}
        label={"Upload Resignation Letter *"}
        defaultValue={getValues("resignationLetter")}
      />
    );

  useEffect(() => {
    const fileLink = async () => {
      const link = async () => {
        if (!isNil(resignationLetter) && !isEmpty(resignationLetter)) {
          const response = await getDownloadLink({
            key: resignationLetter.uploadedName,
            fileName: resignationLetter.originName
          });
          if (!isNil(response) && !isEmpty(response)) {
            setFileDownloadLink(response.link);
          }
        }
        return;
      };
      await link();
    };
    if (status.disabled) {
      fileLink();
    }
  }, [resignationLetter, status.disabled]);

  return (
    <>
      <DepartureReasonSelect
        name={"departureReason"}
        label={"Departure Reason *"}
        placeholder={"Select an option"}
      />
      {status.disabled && fileDownloadLink ? (
        <>
          <div className={"form-group text-right"}>
            <label>Download the resignation letter</label>
            <a
              href={fileDownloadLink}
              className={"text-center file-link"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {resignationLetter.originName}
            </a>
          </div>
        </>
      ) : (
        fileBrowser()
      )}

      {"Other".includes(getValues("departureReason")) && (
        <EEFormTextArea
          name={"otherReason"}
          label={"Other"}
          placeholder={"Please comment another reason"}
          requiredLabel={"This field is required"}
        ></EEFormTextArea>
      )}

      <EEFormDatePicker
        name={"lastDayInTheOffice"}
        label={"Last day in the office *"}
        onDateChange={onLastDayInTheOfficeChange}
      />

      <EEFormDatePicker
        name={"lastDayOfEmployment"}
        label={"Last day of employment *"}
      />
      {children}
    </>
  );
};

export default DepartureDetails;
