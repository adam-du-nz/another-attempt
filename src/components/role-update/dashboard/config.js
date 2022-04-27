import { compareDate, compareString } from "../../../utils";

export const tableColumns = [
  { key: "employeeName", description: "Employee Name", align: "center" },
  { key: "submittedBy", description: "Submitted By", align: "center" },
  { key: "submittedDate", description: "Submitted Date", align: "center" },
  { key: "effectiveDate", description: "Effective Date", align: "center" },
  { key: "changeType", description: "Change Type" },
  { key: "status", description: "Status" }
];

export const sort = {
  employeeName: (compare, compared) =>
    compareString(compare.employeeName, compared.employeeName),
  submittedBy: (compare, compared) =>
    compareString(compare.submittedBy, compared.submittedBy),
  submittedDate: (compare, compared) =>
    compareDate(compare.submittedDate, compared.submittedDate, "dd/MM/yyyy"),
  effectiveDate: (compare, compared) =>
    compareDate(compare.effectiveDate, compared.effectiveDate, "dd/MM/yyyy"),
  changeType: (compare, compared) =>
    compareString(compare.changeType, compared.changeType),
  status: (compare, compared) => compareString(compare.status, compared.status)
};
