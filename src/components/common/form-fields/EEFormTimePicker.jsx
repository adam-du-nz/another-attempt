import React, { useContext } from "react";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import { Controller, useFormContext } from "react-hook-form";
import { StatusContext } from "../../../entities/StatusContext";
import { format, fromUnixTime } from "date-fns";
import moment from "moment";
import { anyPass, isEmpty, isNil } from "ramda";
import { Field } from "@myob/myob-widgets";

export default function EEFormTimePicker({ name, label }) {
  const {
    control,
    formState: { errors }
  } = useFormContext();
  const [status] = useContext(StatusContext);

  const convertTime = unixTimeStamp => {
    if (isNil(unixTimeStamp)) {
      return "";
    }
    const convertedTime = fromUnixTime(unixTimeStamp / 1000);
    const extractedTime = format(convertedTime, "hh:mm a");
    return extractedTime;
  };

  return (
    <>
      <Field
        label={label}
        renderField={() => (
          <>
            <div className="flx-timepicker" role="presentation">
              <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TimePicker
                    id={name}
                    disabled={status.disabled}
                    className={errors[name]?.message ? "error-message" : ""}
                    showSecond={false}
                    minuteStep={15}
                    onChange={val => {
                      onChange(convertTime(val));
                    }}
                    value={
                      anyPass([isNil, isEmpty])(value)
                        ? null
                        : moment(value, "hh:mm a")
                    }
                    use12Hours
                    inputReadOnly
                  />
                )}
              />
            </div>
            {errors[name]?.message && (
              <div>
                <span className="error-message">{errors[name].message}</span>
              </div>
            )}
          </>
        )}
      />
    </>
  );
}
