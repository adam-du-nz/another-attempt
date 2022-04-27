import * as yup from "yup";
import { all, isNil, includes } from "ramda";

export const schema = ({
  hideImpactOfDeparture,
  shouldShowOnsiteRepresentativeSelection
}) =>
  yup.object().shape({
    employee: yup.object().required("Select a team member"),

    departureReason: yup
      .string()
      .ensure()
      .required("Select a departure reason"),

    lastDayInTheOffice: yup
      .string()
      .required("Select employee's last day in the office"),

    departureImpact: yup
      .string()
      .ensure()
      .when("departureReason", {
        is: departureReason => !hideImpactOfDeparture.has(departureReason),
        then: s => s.required("Select the impact of this departure")
      }),

    otherReason: yup
      .string()
      .ensure()
      .when("departureReason", {
        is: departureReason => "Other".includes(departureReason),
        then: s => s.required("Provide another reason")
      }),

    collectorName: yup
      .object()
      .when([], schema =>
        shouldShowOnsiteRepresentativeSelection()
          ? schema.required(
              "Select a team member to collect the MYOB equipment"
            )
          : schema
      ),

    lastDayOfEmployment: yup
      .string()
      .ensure()
      .required("Select employee's last day of employment")
      .test({
        name: "isLastDayOfEmploymentGreaterThanLastDayInTheOffice",
        exclusive: true,
        message:
          "Last day of employment must be the same or after the last day in the office",
        test: function (lastDayOfEmployment) {
          return (
            !this.parent.lastDayInTheOffice ||
            Date.parse(this.parent.lastDayInTheOffice) <=
              Date.parse(lastDayOfEmployment)
          );
        }
      }),

    newManager: yup
      .object()
      .when("hasDirectReports", (hasDirectReports, schema) => {
        return hasDirectReports === "true"
          ? schema.required("Select new replacement manager")
          : schema;
      }),

    /** Attach Documents **/
    resignationLetter: yup.array().when("departureReason", {
      is: value => includes(value, ["Resignation", "Retirement"]),
      then: yup
        .array()
        .ensure([])
        .required("Mandatory")
        .test("all success", "Some files didn't upload successfully", array =>
          all(v => !isNil(v.uploadedName), array)
        ),
      otherwise: yup.array()
    })
  });
