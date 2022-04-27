import { isValid, format, parse, endOfDay, parseISO } from "date-fns";
import { dateFormat } from "../../../../utils";

const formatDate = date => {
  return format(parseISO(date), dateFormat.ddMMyyyyWithSlash);
};

export const formatFormListResult = form => {
  form.startDate = formatDate(form.startDate);
  form.submittedDate = formatDate(form.submittedDate);
  form.status = getFormStatusForDisplay(form.status);
  return form;
};

const getFormStatusForDisplay = status => {
  switch (status) {
    case "UNEVALUATED":
    case "REOPENED":
      return "Submitted";
    case "CANCELLED":
      return "Cancelled";
    case "APPROVED":
      return "Approved";
    case "CONTRACT_SIGNED":
    case "CONTRACT_SKIPPED":
    case "ALL_SKIPPED":
      return "Contract Signed";
    case "ONBOARDING":
      return "Onboarding";
    case "UPDATE_REQUESTED":
      return "Update Requested";
    case "EMPLOYEE_STARTED":
      return "Employee Started";
    default:
      // should only occur if we get something unexpected
      return status;
  }
};

export const transformStartDateToNumber = startDateString => {
  // parse will convert string to Date with env TimeZone.
  const date = parse(startDateString, "yyyy-MM-dd", new Date());
  if (isValid(date)) {
    return date.getTime();
  }
  return;
};

export const transformFinishDateToNumber = finishDateString => {
  const date = parse(finishDateString, "yyyy-MM-dd", new Date());
  if (isValid(date)) {
    return endOfDay(date).getTime();
  }
  return;
};
