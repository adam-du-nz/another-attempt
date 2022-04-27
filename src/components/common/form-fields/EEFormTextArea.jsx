import { TextArea } from "@myob/myob-widgets";
import { Controller, useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import React, { useContext } from "react";
import { StatusContext } from "../../../entities/StatusContext";

const EEFormTextArea = ({ name, label, ...textAreaProps }) => {
  const {
    control,
    formState: { errors }
  } = useFormContext();
  const [status] = useContext(StatusContext);
  const errorMessage = errors[name]?.message;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <TextArea
          name={name}
          label={label}
          disabled={status.disabled}
          errorMessage={errorMessage}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          value={value}
          reference={ref}
          rows={5}
          autoSize
          resize={"vertical"}
          {...textAreaProps}
        />
      )}
    />
  );
};
EEFormTextArea.prototype = {
  name: PropTypes.string,
  label: PropTypes.string
};
export default EEFormTextArea;
