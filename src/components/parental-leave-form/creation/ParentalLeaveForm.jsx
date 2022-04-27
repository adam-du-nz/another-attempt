import {
  ButtonRow,
  Button,
  FormHorizontal,
  PageHead
} from "@myob/myob-widgets";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import HttpStatus from "http-status-codes";
import React, { useEffect } from "react";
import Card from "../../common/Card";
import { EEFormSelect } from "../../common/form-fields";
import {
  leaveEntitlements,
  newZealandSavingContribution,
  australianGovernmentLeavePolicy,
  parentalLeaveFormAssemble
} from "./formHelpers";
import { parentalLeaveFormMetaData } from "./parentalLeaveFormMetaData";
import { parentalLeaveValidationSchema } from "./parentalLeaveValidationSchema";
import { submitParentalLeaveForm } from "../../../apis/kilnBackendApis";
import ParentalLeaveAttachment from "./ParentalLeaveAttachment";
import PersonalDetail from "./PersonalDetail";

export default function ParentalLeaveForm() {
  const form = useForm({
    resolver: yupResolver(parentalLeaveValidationSchema),
    mode: "all",
    shouldUnregister: true
  });
  const {
    formState: { errors }
  } = form;
  console.log(form.getValues());
  console.log("errors", errors);

  const valueOfStartOfParentalLeave = form.getValues(
    parentalLeaveFormMetaData.startOfParentalLeave.NAME
  );

  const valueOfPaidLeaveOptions = form.getValues(
    parentalLeaveFormMetaData.paidLeaveOptions.NAME
  );

  useEffect(() => {
    const assignDefaultValueToStartOfPayment = () => {
      form.setValue(
        parentalLeaveFormMetaData.startOfPayment.NAME,
        valueOfStartOfParentalLeave,
        { shouldValidate: true }
      );
    };
    assignDefaultValueToStartOfPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueOfStartOfParentalLeave, valueOfPaidLeaveOptions]);

  form.watch([
    "employee",
    parentalLeaveFormMetaData.paidLeaveOptions.NAME,
    parentalLeaveFormMetaData.secondaryPaidLeaveOptions.NAME,
    parentalLeaveFormMetaData.secondaryUnpaidLeaveOptions.NAME,
    parentalLeaveFormMetaData.secondaryUnpaidLeaveContinuousPeriodOptions.NAME,
    parentalLeaveFormMetaData.leaveEntitlements.NAME,
    parentalLeaveFormMetaData.startOfLeaveEntitlementsDatePicker.NAME,
    parentalLeaveFormMetaData.endOfLeaveEntitlementsDatePicker.NAME,
    parentalLeaveFormMetaData.startOfUnpaidLeaveDatePicker.NAME,
    parentalLeaveFormMetaData.typeOfParentalLeave.NAME,
    parentalLeaveFormMetaData.startOfParentalLeave.NAME,
    parentalLeaveFormMetaData.endOfParentalLeave.NAME,
    parentalLeaveFormMetaData.startOfPayment.NAME,
    parentalLeaveFormMetaData.startOfWeek1OfNoncontinuousPaidLeave.NAME,
    parentalLeaveFormMetaData.startOfWeek2OfNoncontinuousPaidLeave.NAME,
    parentalLeaveFormMetaData.startOfWeek1OfNoncontinuousUnpaidLeave.NAME,
    parentalLeaveFormMetaData.startOfWeek2OfNoncontinuousUnpaidLeave.NAME
  ]); // you can also target specific fields by their names

  const history = useNavigate();

  const onSubmit = async data => {
    try {
      const res = await submitParentalLeaveForm(data);
      if (res.status === HttpStatus.CREATED) {
        history("/success", {
          messages: ["Parental leave form has been successfully submitted."]
        });
        return;
      }
      if (res.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
        history("/error");
        return;
      }
      history("/error", { messages: [res.body.message] });
    } catch (e) {
      history("/error");
    }
  };

  return (
    <FormProvider {...form}>
      <FormHorizontal layout="primary">
        <PageHead title="Parental Leave" />
        <div>
          <p>
            Congratulations! We hope all is going well as you prepare for this
            exciting chapter in your life. Please complete the below form to
            apply for either Primary or Secondary Caregiver Leave or Surrogacy
            leave.
          </p>
          <p>
            In addition to completing the below form you will need to attach
            copies of a medical certificate confirming the pregnancy and the
            expected date of birth; or relevant adoption paperwork and a
            statutory declaration detailing your leave arrangements and stating
            who will be the child’s primary carer during the period of leave.
          </p>
          <p>
            For more information, access our{" "}
            <a
              href="https://helpme.myob.com/hc/en-us/articles/360009897194"
              target="_blank"
              rel="noopener noreferrer"
            >
              Parental Leave policy
            </a>
            .
          </p>
        </div>
        <form data-testid="parentalLeaveForm">
          <PersonalDetail />
          <Card
            title={"Parental Leave Details"}
            body={
              <>
                <EEFormSelect
                  name={parentalLeaveFormMetaData.typeOfParentalLeave.NAME}
                  label={parentalLeaveFormMetaData.typeOfParentalLeave.LABEL}
                  placeholder="Select a leave option"
                  options={
                    parentalLeaveFormMetaData.typeOfParentalLeave.OPTIONS
                  }
                  errorMessage={errors.typeOfParentalLeave?.message}
                  disabled={!form.getValues().employee?.locationCountry}
                />
                {parentalLeaveFormAssemble(errors, form.getValues)}
                {leaveEntitlements(errors, form.getValues)}
                {form.getValues().employee?.locationCountry === "Australia" &&
                  australianGovernmentLeavePolicy(form.getValues)}
                {form.getValues().employee?.locationCountry === "New Zealand" &&
                  newZealandSavingContribution(form.getValues, form.setValue)}
              </>
            }
          />
          <ParentalLeaveAttachment />
          <ButtonRow>
            <Button onClick={form.handleSubmit(onSubmit)}>Submit</Button>
          </ButtonRow>
        </form>
      </FormHorizontal>
    </FormProvider>
  );
}
