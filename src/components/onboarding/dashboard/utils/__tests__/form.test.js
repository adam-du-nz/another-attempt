import { formatFormListResult } from "../form";

describe("formatFormListResult", () => {
  const form = {
    id: 772,
    employeeName: "Test Employee",
    submittedBy: "Test User",
    startDate: "2022-01-14T00:00:00.000Z",
    submittedDate: "2022-01-01T00:00:00.000Z",
    status: "ALL_SKIPPED",
    primaryOffice: "NZ - Hamilton"
  };

  it("should format the results for display on the dashboard", () => {
    const result = formatFormListResult(form);
    expect(result.id).toStrictEqual(772);
    expect(result.employeeName).toStrictEqual("Test Employee");
    expect(result.submittedBy).toStrictEqual("Test User");
    expect(result.status).toStrictEqual("Contract Signed");
    expect(result.startDate).toStrictEqual("14/01/2022");
    expect(result.submittedDate).toStrictEqual("01/01/2022");
    expect(result.primaryOffice).toStrictEqual("NZ - Hamilton");
  });
});
