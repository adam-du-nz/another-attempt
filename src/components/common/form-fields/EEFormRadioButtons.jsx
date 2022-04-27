import { Controller, useFormContext } from "react-hook-form";
import { RadioButtonGroup } from "@myob/myob-widgets";
import PropTypes from "prop-types";
import { StatusContext } from "../../../entities/StatusContext";
import React, { useContext } from "react";

const EEFormRadioButtons = ({ name, label, options, ...radioButtonsProps }) => {
  const { control, formState: { errors } } = useFormContext();
  const [status] = useContext(StatusContext);
  const errorMessage = errors[name]?.message;
  return (
    <>
      <Controller
        id={name}
        name={name}
        control={control}
        render={({ field: { onChange, value, ref }}) => (
          <RadioButtonGroup
            name={name}
            label={label}
            inputRef={ref}
            options={options}
            value={value}
            disabled={status.disabled}
            errorMessage={errorMessage}
            onChange={value => onChange(value.value)}
            {...radioButtonsProps}
          />
        )}
      />
    </>
  );
};

EEFormRadioButtons.prototype = {
  name: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.any
};

export default EEFormRadioButtons;
