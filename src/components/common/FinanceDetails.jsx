import { includes } from "ramda";
import React, { useEffect, useState } from "react";
import { DollarIcon } from "@myob/myob-widgets";
import { EEFormInput, EEFormCheckbox, EEFormFileInput } from "./form-fields";
import Card from "./Card";
import FormAlert from "./FormAlert";
import { commonMetaData } from "./commonMetaData";
import { useFormContext } from "react-hook-form";
import { arrayExtractor, isNilOrEmpty } from "../../utils/index";

const FinanceDetails = () => {
  const { getValues, setValue } = useFormContext();
  const [cappedCreditLimit, setCappedCreditLimit] = useState(0);
  const [cappedApprovalLimit, setCappedApprovalLimit] = useState(0);

  // Calculate credit limit based on country of primary office
  const office = getValues(commonMetaData.primaryOffice.NAME);
  const creditLimitField = commonMetaData.financeDetails.creditLimit.NAME;
  const creditCardField = commonMetaData.financeDetails.creditCard.NAME;
  const creditCard = commonMetaData.financeDetails.creditCard.OPTIONS[0].name;

  const creditLimitVisible =
    String(arrayExtractor(getValues(creditCardField))) === creditCard;
  useEffect(() => {
    const determineCreditLimit = () => {
      if (isNilOrEmpty(getValues(creditLimitField)) && creditLimitVisible) {
        if (String(office).toUpperCase().startsWith("AU")) {
          setValue(commonMetaData.financeDetails.creditLimit.NAME, "5000", {
            shouldValidate: true
          });
          setCappedCreditLimit(5000);
        } else {
          setValue(commonMetaData.financeDetails.creditLimit.NAME, "3000", {
            shouldValidate: true
          });
          setCappedCreditLimit(3000);
        }
      }
    };
    determineCreditLimit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [office, creditLimitVisible]);

  // Calculate delegated authority limit based on team member level
  const teamMemberLevel = getValues(commonMetaData.teamMemberLevel.NAME);
  const delegatedApprovalField =
    commonMetaData.financeDetails.delegatedApprovalAuthority.NAME;
  const approval =
    commonMetaData.financeDetails.delegatedApprovalAuthority.OPTIONS[0].name;
  const approvalLimitField = commonMetaData.financeDetails.approvalLimit.NAME;

  const isTeamMemberLevelAboveTeamLeader = includes(String(teamMemberLevel), [
    "SLT",
    "ELT"
  ]);

  const approvalLimitVisible =
    String(arrayExtractor(getValues(delegatedApprovalField))) === approval;
  useEffect(() => {
    const determineApprovalLimit = () => {
      if (isNilOrEmpty(getValues(approvalLimitField)) && approvalLimitVisible) {
        if (String(teamMemberLevel) === "SLT") {
          setValue(approvalLimitField, "150000", { shouldValidate: true });
          setCappedApprovalLimit(150000);
        } else if (String(teamMemberLevel) === "ELT") {
          setValue(approvalLimitField, "500000", { shouldValidate: true });
          setCappedApprovalLimit(500000);
        } else {
          setValue(approvalLimitField, "0", { shouldValidate: true });
          setCappedApprovalLimit(0);
        }
      }
    };
    determineApprovalLimit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamMemberLevel, approvalLimitVisible]);

  return (
    <Card
      title={"Finance Details"}
      body={
        <>
          <EEFormCheckbox
            name={commonMetaData.financeDetails.creditCard.NAME}
            label={commonMetaData.financeDetails.creditCard.LABEL}
            options={commonMetaData.financeDetails.creditCard.OPTIONS}
          ></EEFormCheckbox>
          {arrayExtractor(getValues(creditCardField)) === creditCard && (
            <EEFormInput
              id={commonMetaData.financeDetails.creditLimit.NAME}
              name={commonMetaData.financeDetails.creditLimit.NAME}
              label={commonMetaData.financeDetails.creditLimit.LABEL}
              type="number"
              max={cappedCreditLimit}
              prefixIcon={<DollarIcon />}
            ></EEFormInput>
          )}
          {isTeamMemberLevelAboveTeamLeader && (
            <>
              <EEFormCheckbox
                name={
                  commonMetaData.financeDetails.delegatedApprovalAuthority.NAME
                }
                label={
                  commonMetaData.financeDetails.delegatedApprovalAuthority.LABEL
                }
                options={
                  commonMetaData.financeDetails.delegatedApprovalAuthority
                    .OPTIONS
                }
              ></EEFormCheckbox>
              <FormAlert
                alertMessage="For more information, visit [MYOB Expenditure - Limits of Authority](https://helpme.myob.com/hc/en-us/articles/360026506513)."
                alertType="info"
              ></FormAlert>

              {arrayExtractor(getValues(delegatedApprovalField)) ===
                approval && (
                <EEFormInput
                  id={commonMetaData.financeDetails.approvalLimit.NAME}
                  name={commonMetaData.financeDetails.approvalLimit.NAME}
                  label={commonMetaData.financeDetails.approvalLimit.LABEL}
                  type="number"
                  max={cappedApprovalLimit}
                  prefixIcon={<DollarIcon />}
                ></EEFormInput>
              )}
            </>
          )}
          {(arrayExtractor(getValues(delegatedApprovalField)) === approval ||
            arrayExtractor(getValues(creditCardField)) === creditCard) && (
            <EEFormFileInput
              name={"financeAttachments"}
              label={"Approval Documentation"}
              promptMessage={
                "SLT approval document for a Credit Card and/or Delegated Authority limit"
              }
            />
          )}
        </>
      }
    />
  );
};

export default FinanceDetails;
