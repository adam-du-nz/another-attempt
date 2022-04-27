import React, { useContext, useState, useEffect } from "react";
import { Combobox } from "@myob/myob-widgets";
import { Controller, useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import { StatusContext } from "../../../entities/StatusContext";
import { omit } from "ramda";
import { isNotNilEmpty } from "../../../utils";

const EEFormSearch = ({ name, transform, ...searchProps }) => {
  const {
    control,
    formState: { errors },
    getValues,
    setValue
  } = useFormContext();
  const [selected, setSelected] = useState();
  const [status] = useContext(StatusContext);
  const errorMessage = errors[name]?.message;
  const _value = getValues(`_${name}`);
  useEffect(() => {
    if (isNotNilEmpty(_value)) {
      setSelected({ [name]: _value });
      setValue(name, _value, {
        shouldValidate: true
      });
    }
  }, [_value, name, setValue]);

  return (
    <Controller
      id={name}
      control={control}
      name={name}
      render={({ field: { onChange, value, ...methods } }) => {
        return (
          <Combobox
            name={name}
            onChange={e => {
              setSelected(e);
              transform && transform.output
                ? onChange(transform.output(e))
                : onChange(e);
            }}
            selected={selected || value}
            disabled={searchProps?.sealed || status.disabled}
            {...omit(["sealed"])(searchProps)}
            errorMessage={errorMessage}
            {...methods}
          />
        );
      }}
    />
  );
};

EEFormSearch.prototype = {
  name: PropTypes.string,
  label: PropTypes.string,
  items: PropTypes.array,
  metaData: PropTypes.array
};

export default EEFormSearch;
