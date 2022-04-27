import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  EEFormCheckbox,
  EEFormInput,
  EEFormTextArea,
  EEFormRadioButtons
} from "../../common/form-fields";
import { DollarIcon } from "@myob/myob-widgets";
import {
  arrayExtractor,
  isIncluded,
  isNumeric,
  isNilOrEmpty
} from "../../../utils";
import Card from "../../common/Card";
import Location from "../../common/Location";
import { commonMetaData } from "../../common/commonMetaData";
import { roleUpdateMetaData } from "./roleUpdateMetaData";
import RoleUpdateCommission from "./RoleUpdateCommission";

export default function AgreementDetails() {
  const { getValues, setValue, unregister } = useFormContext();
  const [showSuperAndTotalSalary, setShowSuperAndTotalSalary] = useState(false);
  const onWorkingHoursChange = ({ value }) => {
    setValue(
      roleUpdateMetaData.agreementDetails.workingHoursOptions.NAME,
      value
    );
  };

  const [isTransferToCasual, setIsTransferToCasual] = useState(false);
  const selectedPermanentChange = getValues(
    roleUpdateMetaData.changeType.permanentChangeType.NAME
  );
  useEffect(() => {
    const tickSalaryChangeCheckbox = () => {
      setValue(
        roleUpdateMetaData.agreementDetails.salaryChange.NAME,
        [roleUpdateMetaData.agreementDetails.salaryChange.OPTIONS[0].name],
        { shouldValidate: true }
      );
    };

    if (
      getValues(roleUpdateMetaData.changeType.permanentChangeType.NAME) ===
      roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[5].label
    ) {
      setIsTransferToCasual(true);
      tickSalaryChangeCheckbox();
    } else {
      setIsTransferToCasual(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPermanentChange]);

  // Calculate Australian superannuation from base salary
  const AUSTRALIAN_SUPER_RATE = 0.1;
  const baseSalaryValue = getValues(
    roleUpdateMetaData.agreementDetails.baseSalary.NAME
  );
  const selectedEmployee = getValues("employee");
  const newLocationOffice = getValues(commonMetaData.primaryOffice.NAME);

  useEffect(() => {
    const shouldShowSuperAndTotalSalary = () => {
      if (
        (newLocationOffice &&
          isIncluded(String(newLocationOffice).match(/AU - /g), "AU - ")) ||
        (!newLocationOffice &&
          selectedEmployee &&
          selectedEmployee.locationCountry === "Australia")
      ) {
        setShowSuperAndTotalSalary(true);
      } else {
        setShowSuperAndTotalSalary(false);
        unregister(roleUpdateMetaData.agreementDetails.superannuation.NAME);
        unregister(roleUpdateMetaData.agreementDetails.totalSalary.NAME);
      }
    };

    const calculateSuperAndTotalSalary = () => {
      if (isNumeric(baseSalaryValue)) {
        const superannuationValue = Math.round(
          baseSalaryValue * AUSTRALIAN_SUPER_RATE
        );
        const totalSalaryValue =
          parseInt(baseSalaryValue) + parseInt(superannuationValue);
        setValue(
          roleUpdateMetaData.agreementDetails.superannuation.NAME,
          superannuationValue,
          { shouldValidate: true }
        );
        setValue(
          roleUpdateMetaData.agreementDetails.totalSalary.NAME,
          totalSalaryValue,
          { shouldValidate: true }
        );
      }
      if (baseSalaryValue === "" || isNilOrEmpty(baseSalaryValue)) {
        setValue(
          roleUpdateMetaData.agreementDetails.superannuation.NAME,
          null,
          { shouldValidate: true }
        );
        setValue(roleUpdateMetaData.agreementDetails.totalSalary.NAME, null, {
          shouldValidate: true
        });
      }
    };
    shouldShowSuperAndTotalSalary();
    calculateSuperAndTotalSalary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    baseSalaryValue,
    newLocationOffice,
    selectedEmployee,
    showSuperAndTotalSalary
  ]);
  return (
    <Card
      title={"Agreement Details"}
      body={
        <>
          <EEFormCheckbox
            name={roleUpdateMetaData.agreementDetails.locationChange.NAME}
            label={roleUpdateMetaData.agreementDetails.locationChange.LABEL}
            options={roleUpdateMetaData.agreementDetails.locationChange.OPTIONS}
          ></EEFormCheckbox>
          {arrayExtractor(
            getValues(roleUpdateMetaData.agreementDetails.locationChange.NAME)
          ) ===
            roleUpdateMetaData.agreementDetails.locationChange.OPTIONS[0]
              .name && (
            <>
              <Location />
              <EEFormTextArea
                name={
                  roleUpdateMetaData.agreementDetails.commentsOnLocation.NAME
                }
                label={
                  roleUpdateMetaData.agreementDetails.commentsOnLocation.LABEL
                }
              ></EEFormTextArea>
            </>
          )}
          {!isTransferToCasual && (
            <EEFormCheckbox
              name={roleUpdateMetaData.agreementDetails.hoursChange.NAME}
              label={roleUpdateMetaData.agreementDetails.hoursChange.LABEL}
              options={roleUpdateMetaData.agreementDetails.hoursChange.OPTIONS}
            ></EEFormCheckbox>
          )}
          {arrayExtractor(
            getValues(roleUpdateMetaData.agreementDetails.hoursChange.NAME)
          ) ===
            roleUpdateMetaData.agreementDetails.hoursChange.OPTIONS[0].name && (
            <>
              <EEFormRadioButtons
                name={
                  roleUpdateMetaData.agreementDetails.workingHoursOptions.NAME
                }
                label={
                  roleUpdateMetaData.agreementDetails.workingHoursOptions.LABEL
                }
                options={
                  roleUpdateMetaData.agreementDetails.workingHoursOptions
                    .OPTIONS
                }
                onChange={onWorkingHoursChange}
                defaultValue="Full Time Hours"
              ></EEFormRadioButtons>
              {String(
                getValues(
                  roleUpdateMetaData.agreementDetails.workingHoursOptions.NAME
                )
              ) === "Part Time Hours" && (
                <>
                  <EEFormInput
                    name={
                      roleUpdateMetaData.agreementDetails.numberOfHoursPerWeek
                        .NAME
                    }
                    label={
                      roleUpdateMetaData.agreementDetails.numberOfHoursPerWeek
                        .LABEL
                    }
                    placeholder={
                      roleUpdateMetaData.agreementDetails.numberOfHoursPerWeek
                        .PLACEHOLDER
                    }
                    type="number"
                  ></EEFormInput>
                  <EEFormInput
                    name={roleUpdateMetaData.agreementDetails.usualDays.NAME}
                    label={roleUpdateMetaData.agreementDetails.usualDays.LABEL}
                    type="text"
                  ></EEFormInput>
                </>
              )}
              <EEFormTextArea
                name={roleUpdateMetaData.agreementDetails.commentsOnHours.NAME}
                label={
                  roleUpdateMetaData.agreementDetails.commentsOnHours.LABEL
                }
              ></EEFormTextArea>
            </>
          )}
          <EEFormCheckbox
            name={roleUpdateMetaData.agreementDetails.salaryChange.NAME}
            label={roleUpdateMetaData.agreementDetails.salaryChange.LABEL}
            options={roleUpdateMetaData.agreementDetails.salaryChange.OPTIONS}
          ></EEFormCheckbox>
          {arrayExtractor(
            getValues(roleUpdateMetaData.agreementDetails.salaryChange.NAME)
          ) ===
            roleUpdateMetaData.agreementDetails.salaryChange.OPTIONS[0]
              .name && (
            <>
              {!isTransferToCasual && (
                <>
                  <EEFormInput
                    name={roleUpdateMetaData.agreementDetails.baseSalary.NAME}
                    label={roleUpdateMetaData.agreementDetails.baseSalary.LABEL}
                    placeholder={
                      roleUpdateMetaData.agreementDetails.baseSalary.PLACEHOLDER
                    }
                    type="number"
                    prefixIcon={<DollarIcon />}
                  ></EEFormInput>
                  {showSuperAndTotalSalary && (
                    <>
                      <EEFormInput
                        name={
                          roleUpdateMetaData.agreementDetails.superannuation
                            .NAME
                        }
                        label={
                          roleUpdateMetaData.agreementDetails.superannuation
                            .LABEL
                        }
                        type="number"
                        prefixIcon={<DollarIcon />}
                        disabled
                      ></EEFormInput>
                      <EEFormInput
                        name={
                          roleUpdateMetaData.agreementDetails.totalSalary.NAME
                        }
                        label={
                          roleUpdateMetaData.agreementDetails.totalSalary.LABEL
                        }
                        type="number"
                        prefixIcon={<DollarIcon />}
                        disabled
                      ></EEFormInput>
                    </>
                  )}
                </>
              )}
              {isTransferToCasual && (
                <EEFormInput
                  name={commonMetaData.casualHourlyRate.NAME}
                  label={commonMetaData.casualHourlyRate.LABEL}
                  type="number"
                  prefixIcon={<DollarIcon />}
                />
              )}
              <RoleUpdateCommission />
              <EEFormTextArea
                name={roleUpdateMetaData.agreementDetails.commentsOnSalary.NAME}
                label={
                  roleUpdateMetaData.agreementDetails.commentsOnSalary.LABEL
                }
              ></EEFormTextArea>
            </>
          )}
        </>
      }
    />
  );
}
