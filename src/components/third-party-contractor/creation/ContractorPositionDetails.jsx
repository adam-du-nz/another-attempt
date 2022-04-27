import React from "react";
import { thirdPartyContractorFormMetaData } from "./thirdPartyContractorFormMetaData";
import {
  EEFormDatePicker,
  EEFormInput,
  EEFormSelect
} from "../../common/form-fields";
import {
  todayDateFormatted,
  compareMaxStartDateWithPickedFinishDate,
  compareMinEndDateWithPickedStartDate,
  isNotNilEmpty
} from "../../../utils";
import { commonMetaData } from "../../common/commonMetaData";
import PositionFunctionDetails from "../../common/PositionFunctionDetails";
import PositionVerticalDetails from "../../common/PositionVerticalDetails";
import PositionTitle from "../../common/PositionTitle";
import { useFormContext } from "react-hook-form";
import sanitizeHTML from "sanitize-html";

export default function ContractorPositionDetails(form) {
  const { formState: { errors }, getValues, setValue } = useFormContext();

  const addNewPosition = value => {
    if (isNotNilEmpty(value)) {
      const sanitisedValue = sanitizeHTML(value);
      setValue(`_${commonMetaData.positionTitle.NAME}`, sanitisedValue, {
        shouldDirty: true
      });
    }
  };

  return (
    <>
      <PositionTitle addNewPositionFn={addNewPosition} />
      <EEFormDatePicker
        name={thirdPartyContractorFormMetaData.positionDetails.startDate.NAME}
        label={thirdPartyContractorFormMetaData.positionDetails.startDate.LABEL}
        width="sm"
        errorMessage={errors.startDate?.message}
        min={todayDateFormatted()}
        max={compareMaxStartDateWithPickedFinishDate(getValues().endDate)}
      ></EEFormDatePicker>
      <EEFormDatePicker
        name={thirdPartyContractorFormMetaData.positionDetails.endDate.NAME}
        label={thirdPartyContractorFormMetaData.positionDetails.endDate.LABEL}
        width="sm"
        errorMessage={errors.endDate?.message}
        min={compareMinEndDateWithPickedStartDate(getValues().startDate)}
      />
      <EEFormSelect
        key={thirdPartyContractorFormMetaData.positionDetails.location.NAME}
        name={thirdPartyContractorFormMetaData.positionDetails.location.NAME}
        label={thirdPartyContractorFormMetaData.positionDetails.location.LABEL}
        options={
          thirdPartyContractorFormMetaData.positionDetails.location.OPTIONS
        }
        placeholder="Please choose the location"
      ></EEFormSelect>
      {getValues(
        thirdPartyContractorFormMetaData.positionDetails.location.NAME
      ) ===
        thirdPartyContractorFormMetaData.positionDetails.location.OPTIONS[12]
          .label && (
        <EEFormInput
          name={
            thirdPartyContractorFormMetaData.positionDetails.otherLocation.NAME
          }
          label={
            thirdPartyContractorFormMetaData.positionDetails.otherLocation.LABEL
          }
        ></EEFormInput>
      )}
      <PositionFunctionDetails
        functionName={
          thirdPartyContractorFormMetaData.positionDetails.function.NAME
        }
        functionLabel={
          thirdPartyContractorFormMetaData.positionDetails.function.LABEL
        }
        groupName={thirdPartyContractorFormMetaData.positionDetails.group.NAME}
        groupLabel={
          thirdPartyContractorFormMetaData.positionDetails.group.LABEL
        }
        departmentName={
          thirdPartyContractorFormMetaData.positionDetails.department.NAME
        }
        departmentLabel={
          thirdPartyContractorFormMetaData.positionDetails.department.LABEL
        }
        teamName={thirdPartyContractorFormMetaData.positionDetails.team.NAME}
        teamLabel={thirdPartyContractorFormMetaData.positionDetails.team.LABEL}
      ></PositionFunctionDetails>
      <PositionVerticalDetails
        verticalName={
          thirdPartyContractorFormMetaData.positionDetails.vertical.NAME
        }
        verticalLabel={
          thirdPartyContractorFormMetaData.positionDetails.vertical.LABEL
        }
        segmentName={
          thirdPartyContractorFormMetaData.positionDetails.segment.NAME
        }
        segmentLabel={
          thirdPartyContractorFormMetaData.positionDetails.segment.LABEL
        }
      ></PositionVerticalDetails>
    </>
  );
}
