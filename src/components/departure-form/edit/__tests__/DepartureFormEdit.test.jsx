import React from "react";
import mockAxios from "axios";
import { act, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import DepartureFormEdit from "../DepartureFormEdit";
import UserContext from "../../../../auth/UserContext";

const formData = {
  id: 807,
  externalReferenceId: "b0bd8db4-4b9c-4a16-9c70-48cbf8e6bb13",
  type: "DEPARTURE",
  userId: 3571,
  employeeId: 3572,
  createdAt: "2020-05-15T06:48:26.304Z",
  updatedAt: "2020-05-15T06:48:26.304Z",
  status: "PROCESSING",
  formContent: {
    team: "Accountants Nation Leadership",
    group: "Digital Experience",
    formType: "DEPARTURE",
    function: "Employee Experience",
    vertical: "Practice",
    department: "People Consulting",
    employeeId: "3572",
    employeeName: "lin.chen@myob.com",
    teamReadOnly: "Accountants Nation Leadership",
    willBackfill: true,
    lastDayInTheOffice: "20200521",
    lastDayOfEmployment: "20200521",
    groupReadOnly: "Digital Experience",
    managerOffice: "Auckland",
    positionTitle: "Developer",
    locationOffice: "Melbourne - Glen Waverley",
    departureReason: "Resignation",
    functionReadOnly: "Employee Experience",
    hasDirectReports: false,
    verticalReadOnly: "Practice",
    payglobalUsername: "lin.chen",
    departmentReadOnly: "People Consulting",
    positionTitleReadOnly: "Developer",
    locationOfficeReadOnly: "Melbourne - Glen Waverley",
    attachments: [
      {
        uploadedName: "a61cf3a9-99c4-409f-b3f9-dd414c2076c4.doc",
        originName: "test.doc"
      }
    ],
    departeeFullName: "Lin Chen",
    replacementFullName: "",
    onsiteRepresentativeFullName: "",
    managerFullName: "Chris Livett"
  },
  attachments: null,
  employee: {
    id: 3572,
    email: "lin.chen@myob.com",
    positionTitle: "Developer",
    locationOffice: "Melbourne - Glen Waverley",
    createdAt: "2020-05-15T06:47:56.561Z",
    updatedAt: "2020-05-15T06:47:56.561Z",
    payglobalUsername: "lin.chen",
    teamMemberLevel: "People Leader - Influencer",
    locationCountry: "Australia",
    reportingManagerPayglobalUsername: "chris.livett",
    isOnCall: true,
    novatedProjectCode: "123",
    lastBatchId: "fb71adf7-72b5-49ad-ab24-cd383359d8f7",
    firstName: "Lin",
    surname: "Chen",
    isADAccountEnabled: false,
    plannedTerminationDate: "2050-03-19T00:11:13.066Z",
    userPrincipalName: "lin.chen@myob.com",
    phoneNumber: "+61359449044",
    function: "Employee Experience",
    group: "Digital Experience",
    department: "People Consulting",
    team: "Accountants Nation Leadership",
    vertical: "Practice",
    startDate: null,
    visaCode: null,
    visaEffectStartDate: null,
    visaEffectEndDate: null
  }
};
const mockSearchUsers = users => {
  mockAxios.post = jest.fn().mockResolvedValue({ data: users });
};
const pushSpy = jest.fn();
const renderDeparturePreview = ({
  route = "/",
  history = createMemoryHistory({ initialEntries: [route], push: pushSpy })
} = {}) =>
  render(
    <Router history={history}>
      <UserContext.Provider value={{ employee: formData.employee }}>
        <DepartureFormEdit match={{ params: { id: 807 } }}></DepartureFormEdit>
      </UserContext.Provider>
    </Router>
  );

describe("Departure Preview", () => {
  it("should show render form details when a departure form loads ", async () => {
    let getByDisplayValueFunc, queryByLabelTextFunc;
    window.scroll = () => {};
    window.open = () => {};

    await act(async () => {
      mockSearchUsers([{ employee: formData.employee }]);
      mockAxios.get = jest
        .fn()
        .mockResolvedValue({ status: 200, data: formData });
      const route = "/preview";
      const {
        getByDisplayValue,
        queryByLabelText
      } = renderDeparturePreview({ route });
      getByDisplayValueFunc = getByDisplayValue;
      queryByLabelTextFunc = queryByLabelText;
    });
    expect(mockAxios.get).toHaveBeenNthCalledWith(
      1,
      "/api/departure-forms/807"
    );
    expect(getByDisplayValueFunc("Developer")).toBeInTheDocument();
    expect(queryByLabelTextFunc("Other")).not.toBeInTheDocument();
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
