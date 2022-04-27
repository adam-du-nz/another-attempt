import { Checkbox, CheckboxGroup } from "@myob/myob-widgets";
import { Controller, useFormContext } from "react-hook-form";
import { StatusContext } from "../../../entities/StatusContext";
import React, { useContext } from "react";

const EEFormCheckbox = ({ name, options, label }) => {
  const {
    formState: { errors },
    control
  } = useFormContext();
  const [status] = useContext(StatusContext);
  const errorMessage = errors[name]?.message;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value = [], ref } }) => {
        return (
          <CheckboxGroup
            label={label}
            disabled={status.disabled}
            errorMessage={errorMessage}
            inputRef={ref}
            renderCheckbox={() =>
              options.map(option => {
                return (
                  <Checkbox
                    key={option.name}
                    name={option.name}
                    label={option.label}
                    disabled={status.disabled}
                    onChange={event => {
                      if (event.target.checked) {
                        onChange([...value, event.target.name]);
                      } else {
                        onChange(
                          value.filter(checked => checked !== event.target.name)
                        );
                      }
                    }}
                    checked={value.includes(option.name)}
                  />
                );
              })
            }
          />
        );
      }}
    />
  );
};
export default EEFormCheckbox;
