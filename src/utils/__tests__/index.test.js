import {
  format,
  startOfToday,
  startOfTomorrow,
  startOfYesterday,
  addDays,
  addMonths
} from "date-fns";
import {
  wrapNil,
  isNotNilEmpty,
  compareMaxStartDateWithPickedFinishDate,
  compareMinEndDateWithPickedStartDate,
  sanitiseFormData,
  isNilOrEmpty,
  arrayExtractor,
  isWithinXAmountOfDaysInTheFuture,
  calculateProbationPeriod,
  isPlainObj,
  fixFileName
} from "..";

describe("wrapNil", () => {
  it("should wrap null and undefined fields to empty string given object", () => {
    expect(
      wrapNil({
        function: "123",
        group: null,
        department: undefined,
        team: "456",
        vertical: "789"
      })
    ).toMatchObject({
      function: "123",
      group: "",
      department: "",
      team: "456",
      vertical: "789"
    });
  });
});

describe("isNotNilEmpty", () => {
  it("should return true given an object/array/string with content", () => {
    expect(isNotNilEmpty({ x: 1 })).toBe(true);
    expect(isNotNilEmpty([1, 2, 3])).toBe(true);
    expect(isNotNilEmpty("I'm a String")).toBe(true);
  });

  it("should return false given an empty object/array/string", () => {
    expect(isNotNilEmpty({})).toBe(false);
    expect(isNotNilEmpty([])).toBe(false);
    expect(isNotNilEmpty("")).toBe(false);
  });

  it("should return false given null/undefined", () => {
    expect(isNotNilEmpty(null)).toBe(false);
    expect(isNotNilEmpty(undefined)).toBe(false);
  });
});

describe("isNilOrEmpty", () => {
  it("should return false given an object/array/string with content", () => {
    expect(isNilOrEmpty({ x: 1 })).toBe(false);
    expect(isNilOrEmpty([1, 2, 3])).toBe(false);
    expect(isNilOrEmpty("I'm a String")).toBe(false);
  });

  it("should return true given an empty object/array/string", () => {
    expect(isNilOrEmpty({})).toBe(true);
    expect(isNilOrEmpty([])).toBe(true);
    expect(isNilOrEmpty("")).toBe(true);
  });

  it("should return true given null/undefined", () => {
    expect(isNilOrEmpty(null)).toBe(true);
    expect(isNilOrEmpty(undefined)).toBe(true);
  });
});

describe("compare max start date with picked finish date", () => {
  it("should return picked finish date if there is one picked", () => {
    expect(compareMaxStartDateWithPickedFinishDate("2020-09-11")).toBe(
      "2020-09-11"
    );
  });

  it("should not return picked finish date if there is not one picked", () => {
    expect(compareMaxStartDateWithPickedFinishDate(null)).toBeNull();
  });
});

describe("compare min end date with picked start date", () => {
  it("should return today's date if there is no picked start date", () => {
    const today = format(startOfToday(), "yyyy-MM-dd");
    expect(compareMinEndDateWithPickedStartDate(null)).toStrictEqual(today);
  });

  it("should return picked start date if there is one picked", () => {
    expect(compareMinEndDateWithPickedStartDate("2020-09-11")).toBe(
      "2020-09-11"
    );
  });
});

describe("arrayExtractor", () => {
  it("should extract the first element if array exists", () => {
    const areMoreCatsRequired = ["moreCatsRequired"];
    expect(arrayExtractor(areMoreCatsRequired)).toBe("moreCatsRequired");
  });

  it("should return undefined if there is no array", () => {
    expect(arrayExtractor(undefined)).toBeUndefined();
  });
});

describe("sanitise form data", () => {
  const mockFormData = {
    firstName: "<script>",
    surname: "</script>",
    distributionList: ">example1@myob.com >example2@myob.com",
    function: undefined,
    group: { group: "N/A" },
    archieAnalyticIdenticalAccess: {
      fullName: "fullName"
    }
  };
  const sanitisedMockFormData = {
    firstName: " script ",
    surname: " /script ",
    distributionList: " example1@myob.com  example2@myob.com",
    group: "N/A",
    archieAnalyticIdenticalAccess: "fullName"
  };
  it("should remove angle brackets and nested object from the given form data", () => {
    expect(sanitiseFormData(mockFormData)).toMatchObject(sanitisedMockFormData);
  });
});

describe("isWithinXAmountOfDaysInTheFuture", () => {
  it("should return true for a date that is within the coming week", () => {
    const startDate = format(startOfTomorrow(), "yyyy-MM-dd");
    expect(isWithinXAmountOfDaysInTheFuture(startDate, 7)).toBeTruthy();
  });
  it("should false for a date that is in the past", () => {
    const startDate = format(startOfYesterday(), "yyyy-MM-dd");
    expect(isWithinXAmountOfDaysInTheFuture(startDate, 7)).toBeFalsy();
  });
  it("should false for a date that is in the future but NOT within the coming week", () => {
    const startDate = format(addDays(Date.now(), 8), "yyyy-MM-dd");
    expect(isWithinXAmountOfDaysInTheFuture(startDate, 7)).toBeFalsy();
  });
});

describe("calculateProbationPeriod", () => {
  const startDate = format(startOfTomorrow(), "yyyy-MM-dd");
  it("should return '6' for contracts of 12 months or more", () => {
    const endDate = format(addMonths(startOfTomorrow(), 20), "yyyy-MM-dd");
    expect(calculateProbationPeriod(startDate, endDate)).toStrictEqual("6");
  });
  it("should return '3' for contracts of 11 months", () => {
    const endDate = format(addMonths(startOfTomorrow(), 11), "yyyy-MM-dd");
    expect(calculateProbationPeriod(startDate, endDate)).toStrictEqual("3");
  });
  it("should return '2' for contracts of 8 months", () => {
    const endDate = format(addMonths(startOfTomorrow(), 8), "yyyy-MM-dd");
    expect(calculateProbationPeriod(startDate, endDate)).toStrictEqual("2");
  });
  it("should return '1' for contracts of 4 months", () => {
    const endDate = format(addMonths(startOfTomorrow(), 4), "yyyy-MM-dd");
    expect(calculateProbationPeriod(startDate, endDate)).toStrictEqual("1");
  });
  it("should return '0' for contracts of 1 month", () => {
    const endDate = format(addMonths(startOfTomorrow(), 1), "yyyy-MM-dd");
    expect(calculateProbationPeriod(startDate, endDate)).toStrictEqual("0");
  });
  it("should return '0' for contracts of 1 month or less", () => {
    const endDate = format(addDays(startOfTomorrow(), 1), "yyyy-MM-dd");
    expect(calculateProbationPeriod(startDate, endDate)).toStrictEqual("0");
  });
});

class Bar {
  constructor() {
    this.prop = "value";
  }
}
describe("isPlainObj", () => {
  it("should return true given a POJO value", () => {
    expect(isPlainObj({})).toBeTruthy();
    expect(isPlainObj({ prop: "value" })).toBeTruthy();
    expect(isPlainObj({ constructor: Bar })).toBeTruthy();
  });

  it("should return false given a non-POJO value", () => {
    expect(isPlainObj(new Bar())).toBeFalsy();
    expect(isPlainObj(["foo", "bar"])).toBeFalsy();
  });
  it("should return true given a value with prototype of null", () => {
    expect(isPlainObj(Object.create(null))).toBeTruthy();
    const object = Object.create(null);
    object.constructor = Object.prototype.constructor;
    expect(isPlainObj(object)).toBeTruthy();
  });

  it("should return true given a value with `valueOf` property", () => {
    expect(isPlainObj({ valueOf: 1 })).toBeTruthy();
  });

  it("should return true given a value with custom prototype", () => {
    expect(isPlainObj(Object.create({ a: 3 }))).toBeTruthy();
  });
  it("should return false given a non-object value", () => {
    expect(isPlainObj(Symbol)).toBeFalsy();
    expect(isPlainObj(Error)).toBeFalsy();
    expect(isPlainObj(Math)).toBeFalsy();
    expect(isPlainObj(true)).toBeFalsy();
    expect(isPlainObj("abc")).toBeFalsy();
  });
});

describe("fix file names", () => {
  it("should replace em dash", () => {
    expect(fixFileName("em\u2014dash")).toStrictEqual("em-dash");
  });

  it("should replace en dash", () => {
    expect(fixFileName("en\u2013dash")).toStrictEqual("en-dash");
  });
});
