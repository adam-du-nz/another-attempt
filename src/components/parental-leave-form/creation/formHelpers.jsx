import { FieldGroup, PageHead } from "@myob/myob-widgets";
import FormAlert from "../../common/FormAlert";
import {
  EEFormDatePicker,
  EEFormRadioButtons,
  EEFormCheckbox,
  EEFormSelect
} from "../../common/form-fields";
import { parentalLeaveFormMetaData } from "./parentalLeaveFormMetaData";
import React from "react";
import { isNil } from "ramda";
import {
  todayDateFormatted,
  compareMaxStartDateWithPickedFinishDate,
  compareMinEndDateWithPickedStartDate,
  dateFormat,
  isNotNilEmpty
} from "../../../utils";
import { addWeeks, parse, format } from "date-fns";

function AddWeeksToAPickedDate(pickedDate, numberOfWeeks) {
  return isNotNilEmpty(pickedDate)
    ? format(
        addWeeks(
          parse(pickedDate, dateFormat.yyyyMMddWithDash, new Date()),
          numberOfWeeks
        ),
        dateFormat.yyyyMMddWithDash
      )
    : null;
}

function startAndEndDate(errors, getValues) {
  return (
    <>
      <EEFormDatePicker
        name={parentalLeaveFormMetaData.startOfParentalLeave.NAME}
        label={parentalLeaveFormMetaData.startOfParentalLeave.LABEL}
        errorMessage={errors.startOfParentalLeave?.message}
        min={todayDateFormatted()}
        max={compareMaxStartDateWithPickedFinishDate(
          getValues().endOfParentalLeave
        )}
      />
      <EEFormDatePicker
        name={parentalLeaveFormMetaData.endOfParentalLeave.NAME}
        label={parentalLeaveFormMetaData.endOfParentalLeave.LABEL}
        errorMessage={errors.endOfParentalLeave?.message}
        min={compareMinEndDateWithPickedStartDate(
          getValues().startOfParentalLeave
        )}
      />
    </>
  );
}

function startOfPaymentMonthPicker(errors, getValues) {
  return (
    <>
      <FormAlert
        alertType="info"
        alertMessage={`Note: It's possible to commence your parental leave on e.g. the 1st of
          July, but hold your payments commencement date until October.`}
      />
      <EEFormDatePicker
        name={parentalLeaveFormMetaData.startOfPayment.NAME}
        label={parentalLeaveFormMetaData.startOfPayment.LABEL}
        min={
          isNil(getValues(parentalLeaveFormMetaData.startOfParentalLeave.NAME))
            ? todayDateFormatted()
            : getValues(parentalLeaveFormMetaData.startOfParentalLeave.NAME)
        }
        max={getValues(parentalLeaveFormMetaData.endOfParentalLeave.NAME)}
        errorMessage={errors.startOfPayment?.message}
      />
      <FormAlert
        alertType="info"
        alertMessage={`Note: Our monthly pay run is on the 15th day of every month. Where the
        15th falls on a weekend or public holiday, payment will be made on the
        closest business day prior to the 15th.`}
      />
    </>
  );
}

function paidNoncontinuousLeaveDatePickers(errors, getValues) {
  return (
    <>
      <EEFormDatePicker
        name={
          parentalLeaveFormMetaData.startOfWeek1OfNoncontinuousPaidLeave.NAME
        }
        label={
          parentalLeaveFormMetaData.startOfWeek1OfNoncontinuousPaidLeave.LABEL
        }
        errorMessage={errors.startOfWeek1OfNoncontinuousPaidLeave?.message}
        min={todayDateFormatted()}
        max={AddWeeksToAPickedDate(
          getValues().startOfWeek2OfNoncontinuousPaidLeave,
          -1
        )}
      />
      <EEFormDatePicker
        name={
          parentalLeaveFormMetaData.startOfWeek2OfNoncontinuousPaidLeave.NAME
        }
        label={
          parentalLeaveFormMetaData.startOfWeek2OfNoncontinuousPaidLeave.LABEL
        }
        errorMessage={errors.startOfWeek2OfNoncontinuousPaidLeave?.message}
        min={
          isNotNilEmpty(getValues().startOfWeek1OfNoncontinuousPaidLeave)
            ? AddWeeksToAPickedDate(
                getValues().startOfWeek1OfNoncontinuousPaidLeave,
                1
              )
            : AddWeeksToAPickedDate(todayDateFormatted(), 1)
        }
      />
    </>
  );
}

function unpaidNoncontinuousLeaveDatePickers(errors, getValues) {
  return (
    <>
      <EEFormDatePicker
        name={
          parentalLeaveFormMetaData.startOfWeek1OfNoncontinuousUnpaidLeave.NAME
        }
        label={
          parentalLeaveFormMetaData.startOfWeek1OfNoncontinuousUnpaidLeave.LABEL
        }
        errorMessage={errors.startOfWeek1OfNoncontinuousUnpaidLeave?.message}
        min={todayDateFormatted()}
        max={AddWeeksToAPickedDate(
          getValues().startOfWeek2OfNoncontinuousUnpaidLeave,
          -1
        )}
      />
      <EEFormDatePicker
        name={
          parentalLeaveFormMetaData.startOfWeek2OfNoncontinuousUnpaidLeave.NAME
        }
        label={
          parentalLeaveFormMetaData.startOfWeek2OfNoncontinuousUnpaidLeave.LABEL
        }
        errorMessage={errors.startOfWeek2OfNoncontinuousUnpaidLeave?.message}
        min={
          isNotNilEmpty(getValues().startOfWeek1OfNoncontinuousUnpaidLeave)
            ? AddWeeksToAPickedDate(
                getValues().startOfWeek1OfNoncontinuousUnpaidLeave,
                1
              )
            : AddWeeksToAPickedDate(todayDateFormatted(), 1)
        }
      />
    </>
  );
}

function unpaidLeaveDatePicker(errors, getValues) {
  return (
    <>
      <EEFormDatePicker
        name={parentalLeaveFormMetaData.startOfUnpaidLeaveDatePicker.NAME}
        label={parentalLeaveFormMetaData.startOfUnpaidLeaveDatePicker.LABEL}
        errorMessage={errors.startOfUnpaidLeaveDatePicker?.message}
        min={todayDateFormatted()}
      />
    </>
  );
}

function leaveEntitlementsDatePicker(errors, getValues) {
  return (
    <>
      <EEFormDatePicker
        name={parentalLeaveFormMetaData.startOfLeaveEntitlementsDatePicker.NAME}
        label={
          parentalLeaveFormMetaData.startOfLeaveEntitlementsDatePicker.LABEL
        }
        errorMessage={errors.startOfLeaveEntitlementsDatePicker?.message}
        min={todayDateFormatted()}
        max={compareMaxStartDateWithPickedFinishDate(
          getValues().endOfLeaveEntitlementsDatePicker
        )}
      />
      <EEFormDatePicker
        name={parentalLeaveFormMetaData.endOfLeaveEntitlementsDatePicker.NAME}
        label={parentalLeaveFormMetaData.endOfLeaveEntitlementsDatePicker.LABEL}
        errorMessage={errors.endOfLeaveEntitlementsDatePicker?.message}
        min={compareMinEndDateWithPickedStartDate(
          getValues().startOfLeaveEntitlementsDatePicker
        )}
      />
    </>
  );
}

function paidLeaveOptions(errors, getValues) {
  return (
    <>
      <FieldGroup label="Paid Leave">
        <EEFormSelect
          name={parentalLeaveFormMetaData.numberOfWeeksOfPaidLeave.NAME}
          label={parentalLeaveFormMetaData.numberOfWeeksOfPaidLeave.LABEL}
          errorMessage={errors.numberOfWeeksOfPaidLeave?.message}
          defaultValue="14 Weeks"
          options={parentalLeaveFormMetaData.numberOfWeeksOfPaidLeave.OPTIONS}
        ></EEFormSelect>
        <EEFormRadioButtons
          name={parentalLeaveFormMetaData.paidLeaveOptions.NAME}
          label={parentalLeaveFormMetaData.paidLeaveOptions.LABEL.split(
            "\n"
          ).map((i, key) => {
            return (
              <span key={key}>
                {i}
                <br />
              </span>
            );
          })}
          errorMessage={errors.paidLeaveOptions?.message}
          options={parentalLeaveFormMetaData.paidLeaveOptions.OPTIONS}
          defaultValue="14 Weeks"
        />
        {getValues(parentalLeaveFormMetaData.paidLeaveOptions.NAME) ===
          parentalLeaveFormMetaData.paidLeaveOptions.OPTIONS[0] &&
          startOfPaymentMonthPicker(errors, getValues)}
      </FieldGroup>
    </>
  );
}

function secondaryPaidLeaveOptions(errors, getValues) {
  return (
    <>
      <FieldGroup label="Paid Leave">
        <EEFormRadioButtons
          name={parentalLeaveFormMetaData.secondaryPaidLeaveOptions.NAME}
          label={parentalLeaveFormMetaData.secondaryPaidLeaveOptions.LABEL}
          errorMessage={errors.secondaryPaidLeaveOptions?.message}
          options={parentalLeaveFormMetaData.secondaryPaidLeaveOptions.OPTIONS}
        />
        {getValues().secondaryPaidLeaveOptions ===
          parentalLeaveFormMetaData.secondaryPaidLeaveOptions.OPTIONS[0] &&
          startOfPaymentMonthPicker(errors, getValues)}
        {getValues(parentalLeaveFormMetaData.secondaryPaidLeaveOptions.NAME) ===
          parentalLeaveFormMetaData.secondaryPaidLeaveOptions.OPTIONS[1] &&
          paidNoncontinuousLeaveDatePickers(errors, getValues)}
      </FieldGroup>
    </>
  );
}

function secondaryUnpaidLeaveContinuousOptions(errors, getValues) {
  return (
    <>
      <EEFormRadioButtons
        name={
          parentalLeaveFormMetaData.secondaryUnpaidLeaveContinuousPeriodOptions
            .NAME
        }
        label={
          parentalLeaveFormMetaData.secondaryUnpaidLeaveContinuousPeriodOptions
            .LABEL
        }
        errorMessage={
          errors.secondaryUnpaidLeaveContinuousPeriodOptions?.message
        }
        options={
          parentalLeaveFormMetaData.secondaryUnpaidLeaveContinuousPeriodOptions
            .OPTIONS
        }
      />
      {getValues(
        parentalLeaveFormMetaData.secondaryUnpaidLeaveContinuousPeriodOptions
          .NAME
      ) ===
        parentalLeaveFormMetaData.secondaryUnpaidLeaveContinuousPeriodOptions
          .OPTIONS[0] && unpaidLeaveDatePicker(errors, getValues)}
      {getValues(
        parentalLeaveFormMetaData.secondaryUnpaidLeaveContinuousPeriodOptions
          .NAME
      ) ===
        parentalLeaveFormMetaData.secondaryUnpaidLeaveContinuousPeriodOptions
          .OPTIONS[1] && unpaidNoncontinuousLeaveDatePickers(errors, getValues)}
    </>
  );
}

function secondaryUnpaidLeaveOptions(errors, getValues) {
  return (
    <>
      <FieldGroup label="Unpaid Leave">
        <EEFormRadioButtons
          name={parentalLeaveFormMetaData.secondaryUnpaidLeaveOptions.NAME}
          label={parentalLeaveFormMetaData.secondaryUnpaidLeaveOptions.LABEL}
          errorMessage={errors.secondaryUnpaidLeaveOptions?.message}
          options={
            parentalLeaveFormMetaData.secondaryUnpaidLeaveOptions.OPTIONS
          }
        />
        {getValues(
          parentalLeaveFormMetaData.secondaryUnpaidLeaveOptions.NAME
        ) === "Yes" && secondaryUnpaidLeaveContinuousOptions(errors, getValues)}
      </FieldGroup>
    </>
  );
}

export function leaveEntitlements(errors, getValues) {
  if (
    getValues().typeOfParentalLeave ===
      parentalLeaveFormMetaData.typeOfParentalLeave.OPTIONS[0].value ||
    getValues().typeOfParentalLeave ===
      parentalLeaveFormMetaData.typeOfParentalLeave.OPTIONS[1].value
  ) {
    return (
      <>
        <FieldGroup label="Leave Entitlements">
          <EEFormRadioButtons
            name={parentalLeaveFormMetaData.leaveEntitlements.NAME}
            label={parentalLeaveFormMetaData.leaveEntitlements.LABEL}
            errorMessage={errors.leaveEntitlements?.message}
            options={parentalLeaveFormMetaData.leaveEntitlements.OPTIONS}
          />
          {getValues(parentalLeaveFormMetaData.leaveEntitlements.NAME) ===
            parentalLeaveFormMetaData.leaveEntitlements.OPTIONS[0] &&
            leaveEntitlementsDatePicker(errors, getValues)}
        </FieldGroup>
      </>
    );
  }
  return <></>;
}

export function newZealandSavingContribution(getValues, setValue) {
  if (
    getValues().typeOfParentalLeave ===
      parentalLeaveFormMetaData.typeOfParentalLeave.OPTIONS[0].value ||
    getValues().typeOfParentalLeave ===
      parentalLeaveFormMetaData.typeOfParentalLeave.OPTIONS[1].value
  ) {
    return (
      <>
        <FieldGroup label="New Zealand Savings Scheme Contribution">
          <EEFormCheckbox
            name={parentalLeaveFormMetaData.newZealandSavingContribution.NAME}
            label={parentalLeaveFormMetaData.newZealandSavingContribution.LABEL}
            value={getValues(
              parentalLeaveFormMetaData.newZealandSavingContribution.NAME
            )}
            setValue={setValue}
            options={
              parentalLeaveFormMetaData.newZealandSavingContribution.OPTIONS
            }
          />
        </FieldGroup>
        <FieldGroup label="IRD Paid Parental Leave">
          <p>
            If you are eligible to receive Government Paid Parental leave, and
            have completed the employee section of your IRD Paid Parental Leave
            Application (IR880), please upload in the attachments section below.
            We will complete the employers section and return to you to submit
            to the IRD.
          </p>
          <p>
            If you are eligible, and have not yet completed your IRD Paid
            Parental leave form please visit the{" "}
            <a
              href="https://www.ird.govt.nz"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.ird.govt.nz
            </a>{" "}
            and complete your section of the IR880 form. Once you have completed
            your section of the form please send this to peopleteam@myob.com to
            complete the employer section.
          </p>
        </FieldGroup>
      </>
    );
  }
}

export function australianGovernmentLeavePolicy(getValues) {
  const australianPaidLeavePolicy = (
    <FieldGroup label="Australian Government Paid Parental Leave">
      <p>
        In additional to MYOB's paid parental leave, you may be eligible to
        access Government Paid Parental Leave. Click{" "}
        <a
          href="https://www.servicesaustralia.gov.au/individuals/subjects/having-baby"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>{" "}
        for more information.
      </p>
    </FieldGroup>
  );
  const australianDadAndPartnerPolicy = (
    <FieldGroup label="Australian Government Dad and Partner Pay">
      <p>
        In additional to MYOB's paid secondary carers leave, you may be eligible
        to access the Government Dad and Partner Pay. Click{" "}
        <a
          href="https://www.servicesaustralia.gov.au/individuals/services/centrelink/dad-and-partner-pay#group-210"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>{" "}
        for more information.
      </p>
    </FieldGroup>
  );
  if (
    getValues().typeOfParentalLeave ===
    parentalLeaveFormMetaData.typeOfParentalLeave.OPTIONS[0].value
  ) {
    return <>{australianPaidLeavePolicy}</>;
  }
  if (
    getValues().typeOfParentalLeave ===
    parentalLeaveFormMetaData.typeOfParentalLeave.OPTIONS[1].value
  ) {
    return (
      <>
        {australianPaidLeavePolicy}
        {australianDadAndPartnerPolicy}
      </>
    );
  }
}

export function parentalLeaveFormAssemble(errors, getValues) {
  const typeOfLeave = getValues().typeOfParentalLeave;
  switch (typeOfLeave) {
    case parentalLeaveFormMetaData.typeOfParentalLeave.OPTIONS[0].value:
      return (
        <>
          <PageHead
            title={
              parentalLeaveFormMetaData.typeOfParentalLeave.OPTIONS[0].label
            }
          />
          {startAndEndDate(errors, getValues)}
          {paidLeaveOptions(errors, getValues)}
        </>
      );

    case parentalLeaveFormMetaData.typeOfParentalLeave.OPTIONS[1].value:
      return (
        <>
          <PageHead
            title={
              parentalLeaveFormMetaData.typeOfParentalLeave.OPTIONS[1].label
            }
          />
          <p>
            If you are a permanent team member with a minimum of 6 months
            continuous service, you are entitled to 2 weeks paid parental leave
            and 2 weeks unpaid leave (4 weeks in total). Note that your leave
            has to be taken either in a continuous two weeks period or a minimum
            one-week chunk.
          </p>
          {secondaryPaidLeaveOptions(errors, getValues)}
          {secondaryUnpaidLeaveOptions(errors, getValues)}
        </>
      );

    case parentalLeaveFormMetaData.typeOfParentalLeave.OPTIONS[2].value:
      return (
        <>
          <PageHead
            title={
              parentalLeaveFormMetaData.typeOfParentalLeave.OPTIONS[2].label
            }
          />
          {startAndEndDate(errors, getValues)}
          {paidLeaveOptions(errors, getValues)}
        </>
      );

    case parentalLeaveFormMetaData.typeOfParentalLeave.OPTIONS[3].value:
      return (
        <>
          <PageHead
            title={
              parentalLeaveFormMetaData.typeOfParentalLeave.OPTIONS[3].label
            }
          />
          <p>
            A surrogate mother is someone who conceives, carries and gives birth
            to a child without financial benefit, for another person or couple.
            The surrogate mother hands over the child to that person or couple
            after the birth. MYOB offers 4 weeks paid Surrogacy Leave to those
            who choose to act as a surrogate mother.{" "}
          </p>
          {startAndEndDate(errors, getValues)}
        </>
      );

    default:
      break;
  }
}
