import { compareDate, compareString } from "../../../utils";

export const tableColumns = [
  { key: "employeeName", description: "Employee Name", align: "center" },
  { key: "positionTitle", description: "Position Title", align: "center" },
  { key: "primaryOffice", description: "Primary Office", align: "center" },
  { key: "submittedBy", description: "Submitted By", align: "center" },
  { key: "submittedDate", description: "Submitted Date", align: "center" },
  { key: "startDate", description: "Start Date", align: "center" },
  { key: "status", description: "Status" }
];

export const sort = {
  employeeName: (compare, compared) =>
    compareString(compare.employeeName, compared.employeeName),
  positionTitle: (compare, compared) =>
    compareString(compare.positionTitle, compared.positionTitle),
  primaryOffice: (compare, compared) =>
    compareString(compare.primaryOffice, compared.primaryOffice),
  submittedBy: (compare, compared) =>
    compareString(compare.submittedBy, compared.submittedBy),
  submittedDate: (compare, compared) =>
    compareDate(compare.submittedDate, compared.submittedDate, "dd/MM/yyyy"),
  startDate: (compare, compared) =>
    compareDate(compare.startDate, compared.startDate, "dd/MM/yyyy"),
  status: (compare, compared) => compareString(compare.status, compared.status)
};
