import React from "react";
import { useFormContext } from "react-hook-form";
import { roleUpdateMetaData } from "./roleUpdateMetaData";
import { EEFormCheckbox, EEFormSelect } from "../../common/form-fields";
import { arrayExtractor } from "../../../utils";

export default function CarAllowance() {
  const { watch } = useFormContext();
  const carAllowanceRequired = watch(
    roleUpdateMetaData.newPosition.carAllowanceRequired.NAME
  );
  const showCarAllowance =
    arrayExtractor(carAllowanceRequired) ===
    roleUpdateMetaData.newPosition.carAllowanceRequired.OPTIONS[0].name;

  return (
    <>
      <EEFormCheckbox
        name={roleUpdateMetaData.newPosition.carAllowanceRequired.NAME}
        label={roleUpdateMetaData.newPosition.carAllowanceRequired.LABEL}
        options={roleUpdateMetaData.newPosition.carAllowanceRequired.OPTIONS}
      ></EEFormCheckbox>
      {showCarAllowance && (
        <EEFormSelect
          name={roleUpdateMetaData.newPosition.carAllowanceAmount.NAME}
          label={roleUpdateMetaData.newPosition.carAllowanceAmount.LABEL}
          options={roleUpdateMetaData.newPosition.carAllowanceAmount.OPTIONS}
          placeholder={"Select a rate"}
        ></EEFormSelect>
      )}
    </>
  );
}
