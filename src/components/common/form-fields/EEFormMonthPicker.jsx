import { Controller, useFormContext } from "react-hook-form";
import { MonthPicker } from "@myob/myob-widgets";
import PropTypes from "prop-types";
import React, { useContext } from "react";
import { StatusContext } from "../../../entities/StatusContext";

const EEFormMonthPicker = ({ name, ...monthPickerProps }) => {
  const {
    control,
    formState: { errors }
  } = useFormContext();
  const [status] = useContext(StatusContext);
  const errorMessage = errors[name]?.message;
  return (
    <Controller
      id={name}
      name={name}
      control={control}
      render={({ field: { onChange, value = "" } }) => (
        <MonthPicker
          {...monthPickerProps}
          name={name}
          value={value}
          disabled={status.disabled}
          onSelect={({ value }) => {
            onChange(value);
          }}
          errorMessage={errorMessage}
        />
      )}
    />
  );
};

EEFormMonthPicker.prototype = {
  name: PropTypes.string,
  label: PropTypes.string,
  control: PropTypes.any
};

export default EEFormMonthPicker;
