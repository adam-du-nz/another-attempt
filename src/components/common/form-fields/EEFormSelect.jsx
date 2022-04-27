import { Controller, useFormContext } from "react-hook-form";
import { Select, Box } from "@myob/myob-widgets";
import React, { useContext } from "react";
import { StatusContext } from "../../../entities/StatusContext";

const EEFormSelect = props => {
  const {
    control,
    formState: { errors }
  } = useFormContext();
  const [status] = useContext(StatusContext);
  const { name, options, placeholder, popover, ...selectProp } = props;
  const errorMessage = errors[name]?.message;
  return (
    <Controller
      render={({ field: { onChange, onBlur, value, name, ref } }) => (
        <Box display="flex" alignItems="center">
          <Select
            name={name}
            disabled={status.disabled}
            reference={ref}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            {...selectProp}
            errorMessage={errorMessage}
            defaultValue="placeholder"
          >
            {placeholder && (
              <Select.Option
                value="placeholder"
                key={placeholder}
                label={placeholder}
                hidden
              />
            )}
            {options.map(option => (
              <Select.Option key={option?.name || option?.value} {...option} />
            ))}
          </Select>
          {popover ? <Box marginBottom="tiny">{popover}</Box> : null}
        </Box>
      )}
      name={name}
      control={control}
    />
  );
};

export default EEFormSelect;
