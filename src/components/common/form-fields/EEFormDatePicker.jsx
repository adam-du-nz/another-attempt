import { Controller, useFormContext } from "react-hook-form";
import { DatePicker } from "@myob/myob-widgets";
import PropTypes from "prop-types";
import { StatusContext } from "../../../entities/StatusContext";
import React, { useContext } from "react";

const EEFormDatePicker = ({ name, ...datePickProps }) => {
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
        <DatePicker
          {...datePickProps}
          disabled={status.disabled}
          name={name}
          value={value}
          errorMessage={errorMessage}
          onSelect={({ value }) => {
            onChange(value);
            datePickProps.onDateChange &&
              datePickProps.onDateChange(name, value);
          }}
        />
      )}
    />
  );
};

EEFormDatePicker.prototype = {
  name: PropTypes.string,
  label: PropTypes.string,
  errorMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  control: PropTypes.any,
  onDateChange: PropTypes.func
};

export default EEFormDatePicker;
