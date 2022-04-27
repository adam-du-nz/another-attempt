import { Input } from "@myob/myob-widgets";
import { useFormContext } from "react-hook-form";
import { StatusContext } from "../../../entities/StatusContext";
import PropTypes from "prop-types";
import React, { useContext } from "react";

const EEFormInput = ({ name, label, ...inputProps }) => {
  const {
    register,
    formState: { errors }
  } = useFormContext();
  const [status] = useContext(StatusContext);
  const errorMessage = errors?.[name]?.message;
  const { onChange, onBlur, ref } = register(name); 
  return (
    <Input
      name={name}
      label={label}
      onChange={onChange}
      onBlur={onBlur}
      disabled={status.disabled}
      errorMessage={errorMessage}
      reference={ref}
      {...inputProps}
    />
  );
};
EEFormInput.prototype = {
  name: PropTypes.string,
  label: PropTypes.string
};
export default EEFormInput;
