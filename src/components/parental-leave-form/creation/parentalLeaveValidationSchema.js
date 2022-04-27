import { all, isNil } from "ramda";
import * as yup from "yup";

export const parentalLeaveValidationSchema = yup.object().shape({
  attachments: yup
    .array()
    .ensure([])
    .required("Mandatory")
    .test("all success", "Some files didn't upload successfully", array =>
      all(v => !isNil(v.uploadedName), array)
    ),
  employee: yup.object().required("Mandatory"),
  typeOfParentalLeave: yup.string().required("Mandatory"),
  newZealandSavingContribution: yup.array(),
  leaveEntitlements: yup
    .string()
    .when("typeOfParentalLeave", {
      is: "Primary Carer Leave",
      then: yup.string().required("Mandatory")
    })
    .when("typeOfParentalLeave", {
      is: "Secondary Carer Leave",
      then: yup.string().required("Mandatory")
    }),
  startOfLeaveEntitlementsDatePicker: yup.string().when("leaveEntitlements", {
    is: "Yes",
    then: yup.string().required("Mandatory")
  }),
  endOfLeaveEntitlementsDatePicker: yup.string().when("leaveEntitlements", {
    is: "Yes",
    then: yup.string().required("Mandatory")
  }),

  secondaryUnpaidLeaveOptions: yup.string().when("typeOfParentalLeave", {
    is: "Secondary Carer Leave",
    then: yup.string().required("Mandatory")
  }),

  secondaryUnpaidLeaveContinuousPeriodOptions: yup
    .string()
    .when(["typeOfParentalLeave", "secondaryUnpaidLeaveOptions"], {
      is: (typeOfParentalLeave, secondaryUnpaidLeaveOptions) =>
        typeOfParentalLeave === "Secondary Carer Leave" &&
        secondaryUnpaidLeaveOptions === "Yes",
      then: yup.string().required("Mandatory")
    }),
  startOfWeek1OfNoncontinuousUnpaidLeave: yup
    .string()
    .when(
      [
        "typeOfParentalLeave",
        "secondaryUnpaidLeaveOptions",
        "secondaryUnpaidLeaveContinuousPeriodOptions"
      ],
      {
        is: (
          typeOfParentalLeave,
          secondaryUnpaidLeaveOptions,
          secondaryUnpaidLeaveContinuousPeriodOptions
        ) =>
          typeOfParentalLeave === "Secondary Carer Leave" &&
          secondaryUnpaidLeaveOptions === "Yes" &&
          secondaryUnpaidLeaveContinuousPeriodOptions ===
            "No, I want to break it up",
        then: yup.string().required("Mandatory")
      }
    ),

  startOfWeek2OfNoncontinuousUnpaidLeave: yup
    .string()
    .when(
      [
        "typeOfParentalLeave",
        "secondaryUnpaidLeaveOptions",
        "secondaryUnpaidLeaveContinuousPeriodOptions"
      ],
      {
        is: (
          typeOfParentalLeave,
          secondaryUnpaidLeaveOptions,
          secondaryUnpaidLeaveContinuousPeriodOptions
        ) =>
          typeOfParentalLeave === "Secondary Carer Leave" &&
          secondaryUnpaidLeaveOptions === "Yes" &&
          secondaryUnpaidLeaveContinuousPeriodOptions ===
            "No, I want to break it up",
        then: yup.string().required("Mandatory")
      }
    ),
  startOfParentalLeave: yup
    .string()
    .when("typeOfParentalLeave", {
      is: "Primary Carer Leave",
      then: yup.string().required("Mandatory")
    })
    .when("typeOfParentalLeave", {
      is: "Sharing Primary Carer Leave",
      then: yup.string().required("Mandatory")
    })
    .when("typeOfParentalLeave", {
      is: "Surrogacy Leave",
      then: yup.string().required("Mandatory")
    }),
  endOfParentalLeave: yup
    .string()
    .when("typeOfParentalLeave", {
      is: "Primary Carer Leave",
      then: yup.string().required("Mandatory")
    })
    .when("typeOfParentalLeave", {
      is: "Sharing Primary Carer Leave",
      then: yup.string().required("Mandatory")
    })
    .when("typeOfParentalLeave", {
      is: "Surrogacy Leave",
      then: yup.string().required("Mandatory")
    }),
  paidLeaveOptions: yup
    .string()
    .when("typeOfParentalLeave", {
      is: "Primary Carer Leave",
      then: yup.string().required("Mandatory")
    })
    .when("typeOfParentalLeave", {
      is: "Sharing Primary Carer Leave",
      then: yup.string().required("Mandatory")
    }),
  startOfPayment: yup
    .string()
    .when("paidLeaveOptions", {
      is: "Paid monthly",
      then: yup.string().required("Mandatory")
    })
    .when("secondaryPaidLeaveOptions", {
      is: "Yes, continuous two week leave period",
      then: yup.string().required("Mandatory")
    }),
  secondaryPaidLeaveOptions: yup.string().when("typeOfParentalLeave", {
    is: "Secondary Carer Leave",
    then: yup.string().required("Mandatory")
  }),
  startOfUnpaidLeaveDatePicker: yup
    .string()
    .when("secondaryUnpaidLeaveContinuousPeriodOptions", {
      is: "Yes, continuous two week leave period",
      then: yup.string().required("Mandatory")
    }),
  startOfWeek1OfNoncontinuousPaidLeave: yup
    .string()
    .when(["typeOfParentalLeave", "secondaryPaidLeaveOptions"], {
      is: (typeOfParentalLeave, secondaryPaidLeaveOptions) =>
        typeOfParentalLeave === "Secondary Carer Leave" &&
        secondaryPaidLeaveOptions === "No, I want to break it up",
      then: yup.string().required("Mandatory")
    }),

  startOfWeek2OfNoncontinuousPaidLeave: yup
    .string()
    .when(["typeOfParentalLeave", "secondaryPaidLeaveOptions"], {
      is: (typeOfParentalLeave, secondaryPaidLeaveOptions) =>
        typeOfParentalLeave === "Secondary Carer Leave" &&
        secondaryPaidLeaveOptions === "No, I want to break it up",
      then: yup.string().required("Mandatory")
    })
});
