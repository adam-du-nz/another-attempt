import { parse, addBusinessDays } from "date-fns";

/**
 * Returns `true` if the "last day" is in the past or within two business days of today.
 * @param {string} lastDay
 */
export const checkLastDay = lastDay => {
  const lastDayInOffice = parse(lastDay, "yyyy-MM-dd", new Date());
  const twoBusinessDays = addBusinessDays(Date.now(), 2);
  return lastDayInOffice <= twoBusinessDays;
};
