import { compareDate, compareString } from "../../../utils";

export const tableColumns = [
  { key: "employeeName", description: "Employee Name", align: "center" },
  { key: "submittedBy", description: "Submitted By", align: "center" },
  {
    key: "lastDayInTheOffice",
    description: "Last Day In The Office",
    align: "center"
  },
  { key: "newManager", description: "New Manager", align: "center" },
  { key: "submittedDate", description: "Submitted Date", align: "center" },
  { key: "status", description: "Status" }
];

export const sort = {
  employeeName: (a, b) => compareString(a.employeeName, b.employeeName),
  submittedBy: (a, b) => compareString(a.submittedBy, b.submittedBy),
  lastDayInTheOffice: (a, b) =>
    compareDate(a.lastDayInTheOffice, b.lastDayInTheOffice, "dd/MM/yyyy"),
  newManager: (a, b) => compareString(a.newManager, b.newManager),
  submittedDate: (a, b) =>
    compareDate(a.submittedDate, b.submittedDate, "dd/MM/yyyy"),
  status: (a, b) => compareString(a.status, b.status)
};
