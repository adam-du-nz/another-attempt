import React, { useContext } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Select } from "@myob/myob-widgets";
import { StatusContext } from "../../entities/StatusContext";
import { commonMetaData } from "./commonMetaData";
import FormAlert from "./FormAlert";

export default function ComputerHardware() {
  const { control, formState: { errors }, getValues } = useFormContext();
  const [status] = useContext(StatusContext);
  const KNOWN_POSSIBLE_SELECTED_VALUES = [
    "Latitude 7420 2-in-1 32GB RAM 512SSD",
    "Precision (7560) 32GB RAM 512SSD",
    "MacBook Pro 14 32GB 512GB",
    "MacBook Pro 16 32GB 512GB"
  ];
  const computerHardwarePreviousSelectedValue = getValues(
    commonMetaData.computerHardware.NAME
  );
  const isInSelectedValues =
    KNOWN_POSSIBLE_SELECTED_VALUES.includes(
      computerHardwarePreviousSelectedValue
    ) || !computerHardwarePreviousSelectedValue;

  return (
    <Controller
      id={commonMetaData.computerHardware.NAME}
      control={control}
      name={commonMetaData.computerHardware.NAME}
      render={({ onChange, value }) => (
        <>
          <Select
            label={commonMetaData.computerHardware.LABEL}
            name={commonMetaData.computerHardware.NAME}
            errorMessage={errors["computerHardware"]?.message}
            defaultValue="placeholder"
            onChange={onChange}
            disabled={status.disabled}
            value={value}
          >
            {isInSelectedValues && (
              <>
                <Select.Option
                  value="placeholder"
                  key="placeholder"
                  label={commonMetaData.computerHardware.PLACEHOLDER}
                  hidden
                />
              </>
            )}
            {!isInSelectedValues && (
              <>
                <Select.Option
                  value={computerHardwarePreviousSelectedValue}
                  label={computerHardwarePreviousSelectedValue}
                />
              </>
            )}
            <Select.OptionGroup label="Laptops">
              <Select.Option
                value="Latitude 7420 2-in-1 32GB RAM 512SSD"
                label="Latitude 7420 2-in-1 32GB RAM 512SSD"
              />
              <Select.Option
                value="Precision (7560) 32GB RAM 512SSD"
                label="Precision (7560) 32GB RAM 512SSD"
              />
              <Select.Option
                value="MacBook Pro 14 32GB 512GB"
                label='MacBook Pro 14" 32GB 512GB'
              />
              <Select.Option
                value="MacBook Pro 16 32GB 512GB"
                label='MacBook Pro 16" 32GB 512GB'
              />
            </Select.OptionGroup>
          </Select>
          {!isInSelectedValues && (
            <FormAlert
              alertMessage="An old computer model is currently selected!"
              alertType="warning"
            ></FormAlert>
          )}
        </>
      )}
    />
  );
}
