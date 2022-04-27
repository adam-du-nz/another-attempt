import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Field } from "@myob/myob-widgets";
import {
  EEFormCheckbox,
  EEFormDatePicker,
  EEFormInput,
  EEFormSelect
} from "../../common/form-fields";
import {
  compareMinEndDateWithPickedStartDate,
  dateFormat,
  isNotNilEmpty,
  tomorrowDateFormatted
} from "../../../utils";
import { roleUpdateMetaData } from "./roleUpdateMetaData";
import Card from "../../common/Card";

export default function ChangeType() {
  const { getValues, setValue } = useFormContext();
  const employee = getValues("employee");
  const type = employee ? employee.employmentType : "";

  // Set current end date for contractors
  const [contractorEndDate, setContractorEndDate] = useState("");
  useEffect(() => {
    if (
      isNotNilEmpty(employee) &&
      employee.employmentType === "COA" &&
      employee.plannedTerminationDate
    ) {
      const date = format(
        Date.parse(employee.plannedTerminationDate),
        dateFormat.yyyyMMddWithDash
      );
      setContractorEndDate(date);
      setValue(
        roleUpdateMetaData.changeType.contractorCurrentEndDate.NAME,
        date
      );
    } else {
      setContractorEndDate("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee, roleUpdateMetaData.changeType.thirdPartyChangeType.NAME]);

  return (
    <>
      {employee && (
        <Card
          title={"Change Type"}
          body={
            <>
              {employee && (type === "FT" || type === "PT") && (
                <>
                  <EEFormSelect
                    key={roleUpdateMetaData.changeType.permanentChangeType.NAME}
                    name={
                      roleUpdateMetaData.changeType.permanentChangeType.NAME
                    }
                    label={
                      roleUpdateMetaData.changeType.permanentChangeType.LABEL
                    }
                    options={
                      roleUpdateMetaData.changeType.permanentChangeType.OPTIONS
                    }
                    placeholder={"Please choose an option"}
                  />
                  {/* Permanent - Transfer or promotion */}
                  {getValues(
                    roleUpdateMetaData.changeType.permanentChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[0]
                      .label && (
                    <EEFormDatePicker
                      name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                      label={roleUpdateMetaData.changeType.effectiveDate.LABEL}
                    />
                  )}
                  {/* Secondment */}
                  {getValues(
                    roleUpdateMetaData.changeType.permanentChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[1]
                      .label && (
                    <>
                      <EEFormDatePicker
                        name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                        label={
                          roleUpdateMetaData.changeType.effectiveDate.LABEL
                        }
                      />
                      <EEFormDatePicker
                        name={
                          roleUpdateMetaData.changeType.secondmentEndDate.NAME
                        }
                        label={
                          roleUpdateMetaData.changeType.secondmentEndDate.LABEL
                        }
                        min={compareMinEndDateWithPickedStartDate(
                          getValues(
                            roleUpdateMetaData.changeType.effectiveDate.NAME
                          )
                        )}
                      />
                    </>
                  )}
                  {/* Permanent - Change to terms of current role */}
                  {getValues(
                    roleUpdateMetaData.changeType.permanentChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[2]
                      .label && (
                    <>
                      <EEFormDatePicker
                        name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                        label={
                          roleUpdateMetaData.changeType.effectiveDate.LABEL
                        }
                      />
                      <EEFormCheckbox
                        key={
                          roleUpdateMetaData.changeType.temporaryTermsChange
                            .NAME
                        }
                        name={
                          roleUpdateMetaData.changeType.temporaryTermsChange
                            .NAME
                        }
                        label={
                          roleUpdateMetaData.changeType.temporaryTermsChange
                            .LABEL
                        }
                        options={
                          roleUpdateMetaData.changeType.temporaryTermsChange
                            .OPTIONS
                        }
                      />
                      {String(
                        getValues(
                          roleUpdateMetaData.changeType.temporaryTermsChange
                            .NAME
                        )
                      ) ===
                        roleUpdateMetaData.changeType.temporaryTermsChange
                          .OPTIONS[0].name && (
                        <EEFormDatePicker
                          name={
                            roleUpdateMetaData.changeType.temporaryTermsEndDate
                              .NAME
                          }
                          label={
                            roleUpdateMetaData.changeType.temporaryTermsEndDate
                              .LABEL
                          }
                          min={compareMinEndDateWithPickedStartDate(
                            getValues(
                              roleUpdateMetaData.changeType.effectiveDate.NAME
                            )
                          )}
                        />
                      )}
                    </>
                  )}
                  {/* Permanent - Reporting line change */}
                  {getValues(
                    roleUpdateMetaData.changeType.permanentChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[3]
                      .label && (
                    <EEFormDatePicker
                      name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                      label={roleUpdateMetaData.changeType.effectiveDate.LABEL}
                    />
                  )}
                  {/* Permanent to fixed-term */}
                  {getValues(
                    roleUpdateMetaData.changeType.permanentChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[4]
                      .label && (
                    <>
                      <EEFormDatePicker
                        name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                        label={
                          roleUpdateMetaData.changeType.effectiveDate.LABEL
                        }
                      />
                      <EEFormInput
                        key={
                          roleUpdateMetaData.changeType.reasonForFixedTerm.NAME
                        }
                        name={
                          roleUpdateMetaData.changeType.reasonForFixedTerm.NAME
                        }
                        label={
                          roleUpdateMetaData.changeType.reasonForFixedTerm.LABEL
                        }
                      />
                      <EEFormDatePicker
                        name={
                          roleUpdateMetaData.changeType.fixedTermEndDate.NAME
                        }
                        label={
                          roleUpdateMetaData.changeType.fixedTermEndDate.LABEL
                        }
                        min={compareMinEndDateWithPickedStartDate(
                          getValues(
                            roleUpdateMetaData.changeType.effectiveDate.NAME
                          )
                        )}
                      />
                    </>
                  )}
                  {/* Permanent to casual */}
                  {getValues(
                    roleUpdateMetaData.changeType.permanentChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[5]
                      .label && (
                    <EEFormDatePicker
                      name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                      label={roleUpdateMetaData.changeType.effectiveDate.LABEL}
                    />
                  )}
                </>
              )}
              {employee && (type === "FT.FIXED" || type === "PT.FIXED") && (
                <>
                  <EEFormSelect
                    key={roleUpdateMetaData.changeType.fixedTermChangeType.NAME}
                    name={
                      roleUpdateMetaData.changeType.fixedTermChangeType.NAME
                    }
                    label={
                      roleUpdateMetaData.changeType.fixedTermChangeType.LABEL
                    }
                    options={
                      roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS
                    }
                    placeholder={"Please choose an option"}
                  />
                  {/* Fixed-term - Contract extension */}
                  {getValues(
                    roleUpdateMetaData.changeType.fixedTermChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[0]
                      .label && (
                    <EEFormDatePicker
                      name={
                        roleUpdateMetaData.changeType.fixedTermNewEndDate.NAME
                      }
                      label={
                        roleUpdateMetaData.changeType.fixedTermNewEndDate.LABEL
                      }
                      min={tomorrowDateFormatted()}
                    />
                  )}
                  {/* Fixed-term - Transfer to permanent */}
                  {getValues(
                    roleUpdateMetaData.changeType.fixedTermChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[1]
                      .label && (
                    <EEFormDatePicker
                      name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                      label={roleUpdateMetaData.changeType.effectiveDate.LABEL}
                    />
                  )}
                  {/* Fixed-term - Transfer to new position */}
                  {getValues(
                    roleUpdateMetaData.changeType.fixedTermChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[2]
                      .label && (
                    <>
                      <EEFormDatePicker
                        name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                        label={
                          roleUpdateMetaData.changeType.effectiveDate.LABEL
                        }
                      />
                      <EEFormDatePicker
                        name={
                          roleUpdateMetaData.changeType.fixedTermEndDate.NAME
                        }
                        label={
                          roleUpdateMetaData.changeType.fixedTermEndDate.LABEL
                        }
                        min={tomorrowDateFormatted()}
                      />
                    </>
                  )}
                  {/* Fixed-term - Change to terms of current role */}
                  {getValues(
                    roleUpdateMetaData.changeType.fixedTermChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[3]
                      .label && (
                    <>
                      <EEFormDatePicker
                        name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                        label={
                          roleUpdateMetaData.changeType.effectiveDate.LABEL
                        }
                      />
                      <EEFormCheckbox
                        key={
                          roleUpdateMetaData.changeType.temporaryTermsChange
                            .NAME
                        }
                        name={
                          roleUpdateMetaData.changeType.temporaryTermsChange
                            .NAME
                        }
                        label={
                          roleUpdateMetaData.changeType.temporaryTermsChange
                            .LABEL
                        }
                        options={
                          roleUpdateMetaData.changeType.temporaryTermsChange
                            .OPTIONS
                        }
                      />
                      {String(
                        getValues(
                          roleUpdateMetaData.changeType.temporaryTermsChange
                            .NAME
                        )
                      ) ===
                        roleUpdateMetaData.changeType.temporaryTermsChange
                          .OPTIONS[0].name && (
                        <EEFormDatePicker
                          name={
                            roleUpdateMetaData.changeType.temporaryTermsEndDate
                              .NAME
                          }
                          label={
                            roleUpdateMetaData.changeType.temporaryTermsEndDate
                              .LABEL
                          }
                          min={compareMinEndDateWithPickedStartDate(
                            getValues(
                              roleUpdateMetaData.changeType.effectiveDate.NAME
                            )
                          )}
                        />
                      )}
                    </>
                  )}
                  {/* Fixed-term - Reporting line change */}
                  {getValues(
                    roleUpdateMetaData.changeType.fixedTermChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[4]
                      .label && (
                    <>
                      <EEFormDatePicker
                        name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                        label={
                          roleUpdateMetaData.changeType.effectiveDate.LABEL
                        }
                      />
                    </>
                  )}
                </>
              )}
              {employee && type === "COA" && (
                <>
                  <EEFormSelect
                    key={
                      roleUpdateMetaData.changeType.thirdPartyChangeType.NAME
                    }
                    name={
                      roleUpdateMetaData.changeType.thirdPartyChangeType.NAME
                    }
                    label={
                      roleUpdateMetaData.changeType.thirdPartyChangeType.LABEL
                    }
                    options={
                      roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS
                    }
                    placeholder={"Please choose an option"}
                  />
                  {/* Contractor to permanent */}
                  {getValues(
                    roleUpdateMetaData.changeType.thirdPartyChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.thirdPartyChangeType
                      .OPTIONS[0].label && (
                    <EEFormDatePicker
                      name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                      label={roleUpdateMetaData.changeType.effectiveDate.LABEL}
                    />
                  )}
                  {/* Contractor to fixed-term */}
                  {getValues(
                    roleUpdateMetaData.changeType.thirdPartyChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.thirdPartyChangeType
                      .OPTIONS[1].label && (
                    <>
                      <EEFormDatePicker
                        name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                        label={
                          roleUpdateMetaData.changeType.effectiveDate.LABEL
                        }
                      />
                      <EEFormInput
                        key={
                          roleUpdateMetaData.changeType.reasonForFixedTerm.NAME
                        }
                        name={
                          roleUpdateMetaData.changeType.reasonForFixedTerm.NAME
                        }
                        label={
                          roleUpdateMetaData.changeType.reasonForFixedTerm.LABEL
                        }
                      />
                      <EEFormDatePicker
                        name={
                          roleUpdateMetaData.changeType.fixedTermEndDate.NAME
                        }
                        label={
                          roleUpdateMetaData.changeType.fixedTermEndDate.LABEL
                        }
                        min={tomorrowDateFormatted()}
                      />
                    </>
                  )}
                  {/* Contractor end date extension */}
                  {getValues(
                    roleUpdateMetaData.changeType.thirdPartyChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.thirdPartyChangeType
                      .OPTIONS[2].label && (
                    <>
                      <EEFormDatePicker
                        name={
                          roleUpdateMetaData.changeType.contractorCurrentEndDate
                            .NAME
                        }
                        label={
                          roleUpdateMetaData.changeType.contractorCurrentEndDate
                            .LABEL
                        }
                        min={contractorEndDate}
                        max={contractorEndDate}
                        defaultValue={contractorEndDate}
                      />
                      <EEFormDatePicker
                        name={
                          roleUpdateMetaData.changeType.contractorNewEndDate
                            .NAME
                        }
                        label={
                          roleUpdateMetaData.changeType.contractorNewEndDate
                            .LABEL
                        }
                        min={tomorrowDateFormatted()}
                      />
                      <EEFormCheckbox
                        key={
                          roleUpdateMetaData.changeType.contractorAcknowledged
                            .NAME
                        }
                        name={
                          roleUpdateMetaData.changeType.contractorAcknowledged
                            .NAME
                        }
                        label={
                          roleUpdateMetaData.changeType.contractorAcknowledged
                            .LABEL
                        }
                        options={
                          roleUpdateMetaData.changeType.contractorAcknowledged
                            .OPTIONS
                        }
                      />
                    </>
                  )}
                  {/* Contractor - Reporting line change */}
                  {getValues(
                    roleUpdateMetaData.changeType.thirdPartyChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.thirdPartyChangeType
                      .OPTIONS[3].label && (
                    <>
                      <EEFormDatePicker
                        name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                        label={
                          roleUpdateMetaData.changeType.effectiveDate.LABEL
                        }
                      />
                    </>
                  )}
                </>
              )}
              {employee && (type === "SEC - FT" || type === "SEC - PT") && (
                <>
                  <EEFormSelect
                    key={
                      roleUpdateMetaData.changeType.secondmentChangeType.NAME
                    }
                    name={
                      roleUpdateMetaData.changeType.secondmentChangeType.NAME
                    }
                    label={
                      roleUpdateMetaData.changeType.secondmentChangeType.LABEL
                    }
                    options={
                      roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS
                    }
                    placeholder={"Please choose an option"}
                  />
                  {/* Secondment - Contract extension */}
                  {getValues(
                    roleUpdateMetaData.changeType.secondmentChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.secondmentChangeType
                      .OPTIONS[0].label && (
                    <EEFormDatePicker
                      name={
                        roleUpdateMetaData.changeType.secondmentNewEndDate.NAME
                      }
                      label={
                        roleUpdateMetaData.changeType.secondmentNewEndDate.LABEL
                      }
                    />
                  )}
                  {/* Permanent transfer following secondment */}
                  {getValues(
                    roleUpdateMetaData.changeType.secondmentChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.secondmentChangeType
                      .OPTIONS[1].label && (
                    <EEFormDatePicker
                      name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                      label={roleUpdateMetaData.changeType.effectiveDate.LABEL}
                    />
                  )}
                  {/* Secondment - Change in terms of current role */}
                  {getValues(
                    roleUpdateMetaData.changeType.secondmentChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.secondmentChangeType
                      .OPTIONS[2].label && (
                    <>
                      <EEFormDatePicker
                        name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                        label={
                          roleUpdateMetaData.changeType.effectiveDate.LABEL
                        }
                      />
                      <EEFormCheckbox
                        key={
                          roleUpdateMetaData.changeType.temporaryTermsChange
                            .NAME
                        }
                        name={
                          roleUpdateMetaData.changeType.temporaryTermsChange
                            .NAME
                        }
                        label={
                          roleUpdateMetaData.changeType.temporaryTermsChange
                            .LABEL
                        }
                        options={
                          roleUpdateMetaData.changeType.temporaryTermsChange
                            .OPTIONS
                        }
                      />
                      {String(
                        getValues(
                          roleUpdateMetaData.changeType.temporaryTermsChange
                            .NAME
                        )
                      ) ===
                        roleUpdateMetaData.changeType.temporaryTermsChange
                          .OPTIONS[0].name && (
                        <EEFormDatePicker
                          name={
                            roleUpdateMetaData.changeType.temporaryTermsEndDate
                              .NAME
                          }
                          label={
                            roleUpdateMetaData.changeType.temporaryTermsEndDate
                              .LABEL
                          }
                          min={compareMinEndDateWithPickedStartDate(
                            getValues(
                              roleUpdateMetaData.changeType.effectiveDate.NAME
                            )
                          )}
                        />
                      )}
                    </>
                  )}
                  {/* Secondment - Reporting line change */}
                  {getValues(
                    roleUpdateMetaData.changeType.secondmentChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.secondmentChangeType
                      .OPTIONS[3].label && (
                    <>
                      <EEFormDatePicker
                        name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                        label={
                          roleUpdateMetaData.changeType.effectiveDate.LABEL
                        }
                      />
                    </>
                  )}
                </>
              )}
              {employee && type === "CAS" && (
                <>
                  <EEFormSelect
                    key={roleUpdateMetaData.changeType.casualChangeType.NAME}
                    name={roleUpdateMetaData.changeType.casualChangeType.NAME}
                    label={roleUpdateMetaData.changeType.casualChangeType.LABEL}
                    options={
                      roleUpdateMetaData.changeType.casualChangeType.OPTIONS
                    }
                    placeholder={"Please choose an option"}
                  />
                  {/* Casual to permanent */}
                  {getValues(
                    roleUpdateMetaData.changeType.casualChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.casualChangeType.OPTIONS[0]
                      .label && (
                    <EEFormDatePicker
                      name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                      label={roleUpdateMetaData.changeType.effectiveDate.LABEL}
                    />
                  )}
                  {/* Casual to fixed-term */}
                  {getValues(
                    roleUpdateMetaData.changeType.casualChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.casualChangeType.OPTIONS[1]
                      .label && (
                    <>
                      <EEFormDatePicker
                        name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                        label={
                          roleUpdateMetaData.changeType.effectiveDate.LABEL
                        }
                      />
                      <EEFormInput
                        key={
                          roleUpdateMetaData.changeType.reasonForFixedTerm.NAME
                        }
                        name={
                          roleUpdateMetaData.changeType.reasonForFixedTerm.NAME
                        }
                        label={
                          roleUpdateMetaData.changeType.reasonForFixedTerm.LABEL
                        }
                      />
                      <EEFormDatePicker
                        name={
                          roleUpdateMetaData.changeType.fixedTermEndDate.NAME
                        }
                        label={
                          roleUpdateMetaData.changeType.fixedTermEndDate.LABEL
                        }
                        min={tomorrowDateFormatted()}
                      />
                    </>
                  )}
                  {/* Casual - Reporting line change */}
                  {getValues(
                    roleUpdateMetaData.changeType.casualChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.casualChangeType.OPTIONS[2]
                      .label && (
                    <>
                      <EEFormDatePicker
                        name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                        label={
                          roleUpdateMetaData.changeType.effectiveDate.LABEL
                        }
                      />
                    </>
                  )}
                </>
              )}
              {employee && type === "MAT" && (
                <>
                  <EEFormSelect
                    key={
                      roleUpdateMetaData.changeType.parentalLeaveChangeType.NAME
                    }
                    name={
                      roleUpdateMetaData.changeType.parentalLeaveChangeType.NAME
                    }
                    label={
                      roleUpdateMetaData.changeType.parentalLeaveChangeType
                        .LABEL
                    }
                    options={
                      roleUpdateMetaData.changeType.parentalLeaveChangeType
                        .OPTIONS
                    }
                    placeholder={"Please choose an option"}
                  />
                  {/* Parental Leave - Reporting line change */}
                  {getValues(
                    roleUpdateMetaData.changeType.parentalLeaveChangeType.NAME
                  ) ===
                    roleUpdateMetaData.changeType.parentalLeaveChangeType
                      .OPTIONS[0].label && (
                    <>
                      <EEFormDatePicker
                        name={roleUpdateMetaData.changeType.effectiveDate.NAME}
                        label={
                          roleUpdateMetaData.changeType.effectiveDate.LABEL
                        }
                      />
                    </>
                  )}
                </>
              )}
              {getValues(
                roleUpdateMetaData.changeType.thirdPartyChangeType.NAME
              ) !==
                roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[2]
                  .label && (
                <>
                  <EEFormCheckbox
                    key={roleUpdateMetaData.changeType.changeApproved.NAME}
                    name={roleUpdateMetaData.changeType.changeApproved.NAME}
                    label={roleUpdateMetaData.changeType.changeApproved.LABEL}
                    options={
                      roleUpdateMetaData.changeType.changeApproved.OPTIONS
                    }
                  />
                  <Field
                    label=""
                    hidelabel
                    renderField={() => (
                      <p className={"sub-header text-left"}>
                        You can find a list of required approvals{" "}
                        <a
                          href="https://helpme.myob.com/hc/en-us/articles/360001297727-Approvals-required-for-people-related-changes"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          here
                        </a>
                      </p>
                    )}
                  ></Field>
                </>
              )}
            </>
          }
        />
      )}
    </>
  );
}
