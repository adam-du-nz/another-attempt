import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { act, render } from "@testing-library/react";
import EmployeeServicesSection from "../EmployeeServicesSection";
import { roleUpdateMetaData } from "../../common/roleUpdateMetaData";
import { FormProvider } from "react-hook-form";

const handleSaveAndUpdateMock = jest.fn();
const handleSaveAndApproveMock = jest.fn();
const handleCancelMock = jest.fn();
const handleReopenMock = jest.fn();
const handleSkipContractMock = jest.fn();
const handleSkipFormMock = jest.fn();

const mockSubmitFunc = {
  handleSaveAndUpdate: handleSaveAndUpdateMock,
  handleSaveAndApprove: handleSaveAndApproveMock,
  handleCancel: handleCancelMock,
  handleReopen: handleReopenMock,
  handleSkipContract: handleSkipContractMock,
  handleSkipForm: handleSkipFormMock
};

describe("EmployeeServices section", () => {
  beforeEach(() => {
    jest.mock("react-hook-form", () => ({
      ...jest.requireActual("react-hook-form"),
      useFormContext: jest.fn().mockResolvedValue({ getValues: jest.fn() })
    }));
  });

  it("should show all buttons when told to", async () => {
    let rendered;
    await act(async () => {
      rendered = render(
        <FormProvider>
          <EmployeeServicesSection
            handleSubmitFunc={mockSubmitFunc}
            showPreviewButton={true}
            showSaveAndUpdateButton={true}
            showSaveAndApproveButton={true}
            showSkipContractButton={true}
            showSkipContractAndFormsButton={true}
            showCancelButton={true}
            cancelButtonText={
              roleUpdateMetaData.cancelButton.cancelContractorToFixedTerm
            }
            probationPeriodProps={{
              shouldDisplay: true,
              fixedTermStartDate: "2021-01-01",
              fixedTermEndDate: "2020-11-15"
            }}
          />
        </FormProvider>
      );
    });
    expect(rendered.getByText("Preview")).toBeInTheDocument();
    expect(rendered.getByText("Save & Update")).toBeInTheDocument();
    expect(rendered.getByText("Save & Approve")).toBeInTheDocument();
    expect(rendered.getByText("Skip Contract")).toBeInTheDocument();
    expect(
      rendered.getByText("Skip Contract and Employment Forms")
    ).toBeInTheDocument();
    expect(
      rendered.getByText("Cancel Contractor to Fixed Term")
    ).toBeInTheDocument();
    expect(
      rendered.getByLabelText("Fixed Term Probation Period (Month)")
    ).toBeInTheDocument();
  });
});
