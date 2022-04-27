import { formatFormListResult } from "../form";

describe("formatFormListResult", () => {
  const form = {
    id: 772,
    employeeName: "Test Employee",
    submittedDate: "2021-10-26T20:23:20.711Z",
    submittedBy: "Test User",
    lastDayInTheOffice: "2022-01-14T00:00:00.000Z",
    status: "PROCESSING"
  };

  it("should format the results for display on the dashboard", () => {
    const result = formatFormListResult(form);
    expect(result.id).toStrictEqual(772);
    expect(result.employeeName).toStrictEqual("Test Employee");
    expect(result.submittedBy).toStrictEqual("Test User");
    expect(result.status).toStrictEqual("Processing");
    expect(result.submittedDate).toStrictEqual("27/10/2021");
    expect(result.lastDayInTheOffice).toStrictEqual("14/01/2022");
  });
});
