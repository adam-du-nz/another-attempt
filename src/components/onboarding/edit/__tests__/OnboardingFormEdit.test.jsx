import React from "react";
import mockAxios from "axios";
import { act, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { format } from "date-fns";

import UserContext from "../../../../auth/UserContext";
import OnboardingFormEdit from "../OnboardingFormEdit";
import * as kilnBackendApis from "../../../../apis/kilnBackendApis";
import { StatusProvider } from "../../../../entities/StatusContext";

const formData = {
  createdAt: "2021-06-10T03:20:02.344Z",
  updatedAt: "2021-06-10T03:54:03.337Z",
  id: 180,
  type: "ONBOARDING",
  submitterId: 20390,
  status: "CANCELLED",
  evaluationStatus: "CANCELLED",
  employee: {
    id: 20426,
    email: "John.Done@myob.com",
    positionTitle: "DevOps Engineer",
    locationOffice: "Auckland",
    createdAt: "2021-03-16T02:09:38.680Z",
    updatedAt: "2021-03-16T02:09:38.680Z",
    payglobalUsername: "John.Done",
    teamMemberLevel: "Team Member",
    locationCountry: "New Zealand",
    reportingManagerPayglobalUsername: "Chris.Livett",
    isOnCall: false,
    novatedProjectCode: null,
    lastBatchId: "fb71adf7-72b5-49ad-ab24-cd383359555",
    firstName: "John",
    surname: "Done",
    fullNameUppercase: "JOHN DOE",
    isADAccountEnabled: true,
    plannedTerminationDate: null,
    userPrincipalName: "John.Done@myob.com",
    phoneNumber: "6496329177",
    function: "Employee Experience",
    group: "Digital Experience",
    department: "Employee Lifecycle & Automatio",
    team: "Not Applicable",
    vertical: "All Company",
    segment: null,
    startDate: format(Date.now(), "dd/MM/yyyy"),
    visaCode: "WV",
    visaEffectStartDate: "2019-05-14T00:00:00.000Z",
    visaEffectEndDate: "2021-05-14T00:00:00.000Z",
    payglobalUserId: "601377739",
    legalFirstName: null,
    employmentType: null
  },
  formContent: {
    team: "Acquisition",
    email: "testTemplates@gmail.com",
    group: "Digital Experience",
    segment: "Not Applicable",
    surname: "EPWM-896",
    function: "Employee Experience",
    jobReqId: null,
    software: [],
    vertical: "Enterprise",
    startDate: format(Date.now(), "dd/MM/yyyy"),
    startTime: "09:00 AM",
    baseSalary: 50000,
    commission: [],
    costCentre: "Tech - SME (SME Other) (8005-395-721)",
    creditCard: [],
    department: "Financial Planning & Analysis",
    localAdmin: ["localAdminAccessRequired"],
    remoteWork: [],
    tShirtSize: "Female - Small",
    phoneNumber: "123456",
    codeRequired: [],
    zendeskQueue: "EPWM-896Queue",
    countryAccess: ["australia", "newZealand"],
    networkDrives: "",
    otherSoftware: "EPWM-896, other software listed",
    positionTitle: "Business Analyst",
    primaryOffice: "NZ - Auckland",
    sharedMailbox: "distribution list ",
    legalFirstName: "testTemplates",
    commentOnArchie: "",
    teamMemberLevel: "Team Member"
  },
  additionalData: {
    cancelledAt: "2021-06-10T03:54:03.323Z",
    cancelReason: "Cancel text reason",
    cancelWorkflowArn:
      "arn:aws:states:ap-southeast-2:313942877558:execution:employment-forms-workflow-onboarding-cancel-preprod:49d7648c660fc6a1caf0b0b0dc933ac8",
    cancelledByUserId: 20390,
    workflowExecutionArn:
      "arn:aws:states:ap-southeast-2:313942877558:execution:employment-forms-workflow-onboarding-submit-preprod:566bbc057ba51eb39408f30cb19713aa"
  }
};

const mockSearchUsers = users => {
  mockAxios.post = jest.fn().mockResolvedValue({ data: users });
};
const pushSpy = jest.fn();
const renderOnboardingPreview = ({
  route = "/",
  history = createMemoryHistory({ initialEntries: [route], push: pushSpy })
} = {}) =>
  render(
    <Router history={history}>
      <UserContext.Provider
        value={{ employee: formData.employee, department: "default" }}
      >
        <StatusProvider>
          <OnboardingFormEdit
            match={{ params: { id: 180 } }}
          ></OnboardingFormEdit>
        </StatusProvider>
      </UserContext.Provider>
    </Router>
  );
const getPositionTitlesSpy = jest.spyOn(kilnBackendApis, "getPositionTitles");
const getCostCentresSpy = jest.spyOn(kilnBackendApis, "getCostCentres");
const getProjectCostCentresSpy = jest.spyOn(
  kilnBackendApis,
  "getProjectCostCentres"
);
const getFunctionsSpy = jest.spyOn(kilnBackendApis, "getFunctions");
const getVerticalsSpy = jest.spyOn(kilnBackendApis, "getVerticals");
const getUsersClassSpy = jest.spyOn(kilnBackendApis, "getUsersClass");
const getOnboardingFormByIdSpy = jest.spyOn(
  kilnBackendApis,
  "getOnboardingFormById"
);

describe("Onboarding Preview", () => {
  beforeEach(() => {
    getPositionTitlesSpy.mockResolvedValue({ data: [] });
    getCostCentresSpy.mockResolvedValue({ data: [] });
    getFunctionsSpy.mockResolvedValue({ data: [] });
    getVerticalsSpy.mockResolvedValue({ data: [] });
    getProjectCostCentresSpy.mockResolvedValue({ data: [] });
    getUsersClassSpy.mockResolvedValue([]);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should show render form details when an onboarding form loads on preview", async () => {
    let queryByLabelFunc, getByDisplayValueFunc, queryByTextFunc;
    await act(async () => {
      mockSearchUsers([{ employee: formData.employee }]);
      const route = "/preview";
      const {
        getByDisplayValue,
        queryByLabelText,
        queryByText
      } = renderOnboardingPreview({
        route
      });
      getOnboardingFormByIdSpy.mockResolvedValue({
        status: 200,
        data: formData
      });
      queryByLabelFunc = queryByLabelText;
      getByDisplayValueFunc = getByDisplayValue;
      queryByTextFunc = queryByText;
    });
    expect(queryByLabelFunc("Cancel Reason")).toBeInTheDocument();
    expect(getByDisplayValueFunc("Cancel text reason")).toBeInTheDocument();
    expect(
      queryByTextFunc(
        "To ensure a great onboarding experience for your new starter",
        { exact: false }
      )
    ).toBeNull();
  });

  it("should render computer hardware dropdown list in disabled status", async () => {
    let getByLabelTextFunc;
    await act(async () => {
      mockSearchUsers([{ employee: formData.employee }]);
      const route = "/preview";
      const { getByLabelText } = renderOnboardingPreview({
        route
      });
      getOnboardingFormByIdSpy.mockResolvedValue({
        status: 200,
        data: formData
      });
      getByLabelTextFunc = getByLabelText;
    });
    expect(getByLabelTextFunc("Computer Hardware")).toBeDisabled();
  });
});
