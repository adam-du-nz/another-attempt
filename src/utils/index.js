import {
  addDays,
  compareAsc,
  differenceInMilliseconds,
  differenceInMonths,
  format,
  parse,
  startOfToday,
  startOfTomorrow
} from "date-fns";
import {
  anyPass,
  both,
  complement,
  curryN,
  equals,
  filter,
  identical,
  isEmpty,
  isNil,
  keys,
  omit,
  pathSatisfies,
  pipe,
  startsWith,
  toString,
  type
} from "ramda";

export const compareNumber = (a, b) => Number(a) - Number(b);
export const compareString = (a, b) => {
  const nameA = a.toUpperCase(); // ignore upper and lowercase
  const nameB = b.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  // names must be equal
  return 0;
};

export const applySort = (data, sortFn, descending) => {
  const result = data.slice();
  result.sort(sortFn);
  return descending ? result.reverse() : result;
};

export const arrayExtractor = array => {
  return isNil(array) ? undefined : array[0];
};

export const compareDate = (dateLeft, dateRight, formatReference) =>
  differenceInMilliseconds(
    parse(dateLeft, formatReference, new Date()),
    parse(dateRight, formatReference, new Date())
  );

export const dateFormat = {
  ddMMyyyyWithSlash: "dd/MM/yyyy",
  yyyyMMdd: "yyyyMMdd",
  yyyyMMddWithDash: "yyyy-MM-dd"
};

export const calculateTotalPages = (total, size) => Math.ceil(total / size);

const wrapNilStringValue = str => (isNil(str) ? "" : str);

export const wrapNil = obj => {
  Object.keys(obj).forEach(key => {
    obj[key] = wrapNilStringValue(obj[key]);
  });
  return obj;
};

export const isNotNilEmpty = complement(anyPass([isNil, isEmpty]));

export const isNilOrEmpty = anyPass([isNil, isEmpty]);

export const todayDateFormatted = () => {
  return format(startOfToday(), "yyyy-MM-dd");
};

export const tomorrowDateFormatted = () => {
  return format(startOfTomorrow(), "yyyy-MM-dd");
};

export const isIncluded = (formArray, targetString) => {
  if (isNotNilEmpty(formArray)) {
    return formArray.includes(targetString);
  }
  return false;
};

export const isNumeric = value => {
  return /^-?\d+$/.test(value);
};

export const compareMaxStartDateWithPickedFinishDate = pickedFinishDate => {
  return isNil(pickedFinishDate) ? null : pickedFinishDate;
};

export const compareAndReturnTheLaterDate = (dateLeft, dateRight) => {
  return compareAsc(dateLeft, dateRight) >= 0 ? dateLeft : dateRight;
};

export const compareMinEndDateWithPickedStartDate = pickedStartDate => {
  return isNil(pickedStartDate)
    ? format(startOfToday(), "yyyy-MM-dd")
    : pickedStartDate;
};

export function sanitiseFormData(data) {
  // Some of the drop-downs have object data instead of strings so we need
  // to extract them here before we send it to the backend.
  const keysToRemove = extractUnderscoredKeysFromObj(data);
  const saneData = { ...omit(keysToRemove)(data) };
  // string replace '<>' with space
  const replaceSpecialChars = field => {
    const replacedField = field.replace(/[<>]/g, " ");
    return replacedField;
  };
  // position details
  saneData.function = data?.function?.function || undefined;
  saneData.group = data?.group?.group || undefined;
  saneData.department = data?.department?.department || undefined;
  saneData.team = data?.team?.team || undefined;
  saneData.vertical = data?.vertical?.vertical || undefined;
  saneData.segment = data?.segment?.segment || undefined;
  saneData.costCentre = data?.costCentre?.costCentre || undefined;
  saneData.projectCostCentre = data?.projectCostCentre?.costCentre || undefined;
  saneData.positionTitle = data?.positionTitle || undefined;
  // IT details
  saneData.archieAnalyticIdenticalAccess =
    data?.archieAnalyticIdenticalAccess?.fullName || undefined;
  saneData.archieIdenticalAccess =
    data?.archieIdenticalAccess?.fullName || undefined;
  saneData.archieReportingManager =
    data?.archieReportingManager?.fullName || undefined;
  saneData.rightNowIdenticalAccess =
    data?.rightNowIdenticalAccess?.fullName || undefined;
  saneData.banklinkCoreIdenticalAccess =
    data?.banklinkCoreIdenticalAccess?.fullName || undefined;

  // effectiveDate fallback
  saneData.effectiveDate =
    saneData?.effectiveDate ||
    format(startOfToday(), dateFormat.yyyyMMddWithDash);
  Object.keys(saneData).forEach(param => {
    if (typeof saneData?.[param] === "string") {
      saneData[param] = replaceSpecialChars(saneData[param]);
    }
  });
  return saneData;
}

/**
 * Returns T/F based on whether the date is within X-amount of days from today.
 * @param {string} dateToCheck the date this func is checking in yyyy-MM-dd
 * @param {number} duration how many days from now on
 */
export const isWithinXAmountOfDaysInTheFuture = (dateToCheck, duration) => {
  const parsedDateToCheck = parse(
    dateToCheck,
    dateFormat.yyyyMMddWithDash,
    new Date()
  );
  const xAmountOfDaysFromNow = addDays(Date.now(), duration);
  return (
    startOfToday() <= parsedDateToCheck &&
    parsedDateToCheck <= xAmountOfDaysFromNow
  );
};

export const calculateProbationPeriod = (startDate, endDate) => {
  const parsedStart = new Date(
    parse(startDate, dateFormat.yyyyMMddWithDash, new Date())
  );
  const parsedEnd = new Date(
    parse(endDate, dateFormat.yyyyMMddWithDash, new Date())
  );
  const diffInMonths = differenceInMonths(parsedEnd, parsedStart);
  // Contracts of longer than 12 months have probation period of six months
  if (diffInMonths >= 12) {
    return "6";
  } else {
    const result = Math.round(diffInMonths * 0.3);
    return result && !Number.isNaN(result) ? result.toString() : "0";
  }
};

const isOfTypeObject = val => typeof val === "object";
const isAsyncFunction = curryN(1, pipe(type, identical("AsyncFunction")));
const isGeneratorFunction = curryN(
  1,
  pipe(type, identical("GeneratorFunction"))
);
const isFunction = anyPass([
  pipe(type, identical("Function")),
  isGeneratorFunction,
  isAsyncFunction
]);
const isObjLike = curryN(1, both(complement(equals(null)), isOfTypeObject));
const isObject = pipe(type, identical("Object"));
const isObjectConstructor = pipe(toString, equals(toString(Object)));
const hasObjectConstructor = pathSatisfies(
  both(isFunction, isObjectConstructor),
  ["constructor"]
);
export const isPlainObj = curryN(1, val => {
  if (!isObjLike(val) || !isObject(val)) {
    return false;
  }

  const proto = Object.getPrototypeOf(val);

  if (equals(null)(proto)) {
    return true;
  }

  return hasObjectConstructor(proto);
});

export const isLocationInPreviewMode = location => {
  const currentPathname = location.pathname.toLowerCase();
  return currentPathname.includes("preview");
};

export const extractUnderscoredKeysFromObj = obj => {
  const keyList = keys(obj);
  const startsWithUnderscore = startsWith("_");
  return filter(startsWithUnderscore, keyList);
};

/** Replaces long dash characters in a filename */
export const fixFileName = filename => {
  return filename.replace(/\u2013|\u2014/g, "-");
};
