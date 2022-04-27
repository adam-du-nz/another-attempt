import { isValid, format, parse, endOfDay, parseISO } from "date-fns";
import { concat, slice, toLower, toUpper } from "ramda";
import { dateFormat } from "../../../../utils";

const formatDate = date => {
  return format(parseISO(date), dateFormat.ddMMyyyyWithSlash);
};

export const formatFormListResult = form => {
  form.submittedDate = formatDate(form.submittedDate);
  form.lastDayInTheOffice = formatDate(form.lastDayInTheOffice);

  form.status = concat(
    toUpper(slice(0, 1, form.status)),
    toLower(slice(1, Infinity, form.status))
  );
  return form;
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
