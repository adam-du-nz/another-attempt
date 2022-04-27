import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { act, render, fireEvent, waitFor } from "@testing-library/react";
import mockAxios from "../../../../__mocks__/axios";
import ThirdPartyContractorFormCreate from "../ThirdPartyContractorFormCreate";

beforeEach(() => {
  mockAxios.get = jest.fn().mockResolvedValue({
    status: 200,
    data: [
      {
        userPrincipalName: "exmaple@myob.com",
        firstName: "example",
        surname: "surname",
        isADAccountEnabled: true
      }
    ]
  });
});

describe("Third Party Contractor Form", () => {
  it("should render card components", async () => {
    let rendered;
    await act(async () => {
      rendered = render(<ThirdPartyContractorFormCreate />);
    });
    expect(rendered.queryByText("Contract Details")).toBeInTheDocument();
    expect(rendered.queryByText("Contractor Details")).toBeInTheDocument();
    expect(
      rendered.queryByText("Contractor Position Details")
    ).toBeInTheDocument();
    expect(rendered.queryByText("IT Details")).toBeInTheDocument();
    expect(rendered.queryByText("Attach Documents")).toBeInTheDocument();
    expect(rendered.queryByText("Final Comments")).toBeInTheDocument();
  });
  it("should render Contract Details", async () => {
    let rendered;
    await act(async () => {
      rendered = render(<ThirdPartyContractorFormCreate />);
    });
    expect(
      rendered.getByLabelText(
        "Manager Name (Who will the contractor be reporting to/working for?)"
      )
    ).toBeInTheDocument();
    expect(
      rendered.getByText("No (The Employee Services team will be in touch)")
    ).toBeInTheDocument();
    expect(
      rendered.getByText("Independent Contractor Questionnaire completed?")
    ).toBeInTheDocument();
    expect(rendered.getByLabelText("Company Name")).toBeInTheDocument();
    expect(
      rendered.getByLabelText("Company Postal Address")
    ).toBeInTheDocument();
    expect(
      rendered.getByLabelText("Company ABN number (AU) or IRD number (NZ)")
    ).toBeInTheDocument();
  });

  it("should render Contractor Details section", async () => {
    let rendered;
    await act(async () => {
      rendered = render(<ThirdPartyContractorFormCreate />);
    });
    expect(rendered.getByLabelText("Preferred First Name")).toBeInTheDocument();
    expect(rendered.getByLabelText("Last Name")).toBeInTheDocument();
    expect(
      rendered.getByLabelText("Email Address (not an MYOB email)")
    ).toBeInTheDocument();
    expect(rendered.getByLabelText("Mobile Phone")).toBeInTheDocument();
  });

  it("should render attachments when upload success and remove when click remove btn", async () => {
    let rendered;
    await act(async () => {
      rendered = render(<ThirdPartyContractorFormCreate />);
    });
    mockAxios.post = jest
      .fn()
      .mockResolvedValue({ status: 201, data: { filename: "dummy.png" } })
      .mockResolvedValue({ status: 201, data: { filename: "dummy2.pdf" } });
    const file = new File(["dummy content"], "dummy.png", {
      type: "image/png"
    });
    const file2 = new File(["dummy content"], "dummy2.pdf", {
      type: "pdf"
    });
    const inputEl = rendered.container.querySelector("#fileInput");
    Object.defineProperty(inputEl, "files", {
      value: [file, file2]
    });
    await act(async () => {
      fireEvent.change(inputEl);
    });
    await waitFor(() => expect(mockAxios.post).toHaveBeenCalledTimes(2));
    expect(rendered.queryAllByText("dummy.png")).toHaveLength(1);
    expect(rendered.queryAllByText("dummy2.pdf")).toHaveLength(1);
    await act(async () => {
      fireEvent.click(rendered.container.querySelector(".remove-button"));
    });
    expect(rendered.queryAllByText("dummy.png")).toHaveLength(0);
    expect(rendered.queryAllByText("dummy2.pdf")).toHaveLength(1);
    await act(async () => {
      fireEvent.click(rendered.container.querySelector(".remove-button"));
    });
    expect(rendered.queryAllByText("dummy2.pdf")).toHaveLength(0);
  });

  it("should render Contractor Position Details section", async () => {
    let rendered;
    await act(async () => {
      rendered = render(<ThirdPartyContractorFormCreate />);
    });

    expect(rendered.getByLabelText("Position Title")).toBeInTheDocument();
    expect(
      rendered.getByLabelText(
        "Start Date (if unknown, please select the earliest possible start date)"
      )
    ).toBeInTheDocument();
    expect(
      rendered.getByLabelText(
        "End Date (if unknown, select no longer than six months)"
      )
    ).toBeInTheDocument();
    expect(rendered.getByLabelText("Location")).toBeInTheDocument();
    expect(rendered.getByLabelText("Function")).toBeInTheDocument();
    expect(rendered.getByLabelText("Group")).toBeInTheDocument();
    expect(rendered.getByLabelText("Department")).toBeInTheDocument();
    expect(rendered.getByLabelText("Team")).toBeInTheDocument();
    expect(rendered.getByLabelText("Vertical")).toBeInTheDocument();
    expect(rendered.getByLabelText("Segment")).toBeInTheDocument();
  });

  it("should validate Contractor Position Details section", async () => {
    let rendered;
    await act(async () => {
      rendered = render(<ThirdPartyContractorFormCreate />);
    });

    // 'Specify Other Location' should only show when 'Location' is set to 'Other'
    expect(
      rendered.queryByLabelText("Specify Other Location")
    ).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Location"), {
        target: { value: "Other (Please Specify below)" }
      });
    });
    expect(
      rendered.getByLabelText("Specify Other Location")
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.blur(rendered.getByLabelText("Specify Other Location"));
    });
    expect(rendered.getByText("Please specify location")).toBeInTheDocument();
  });

  it("should render Final Comments section", async () => {
    let rendered;
    await act(async () => {
      rendered = render(<ThirdPartyContractorFormCreate />);
    });

    expect(
      rendered.getByLabelText(
        "Add anything else we might need to know about the Third Party Contractor"
      )
    ).toBeInTheDocument();
  });

  it("should render IT Details", async () => {
    let rendered;
    await act(async () => {
      rendered = render(<ThirdPartyContractorFormCreate />);
    });
    const radioButtonHasOwnHardware = rendered.container.querySelector(
      "input[name='hasOwnHardware'][value='No']"
    );
    await act(async () => {
      fireEvent.click(radioButtonHasOwnHardware);
    });
    expect(rendered.getByLabelText(/Computer Hardware/i)).toBeInTheDocument();
    const radioButtonNetworkAccessRequired = rendered.container.querySelector(
      "input[name='isNetworkAccessRequired'][value='Yes']"
    );
    await act(async () => {
      fireEvent.click(radioButtonNetworkAccessRequired);
    });
    expect(rendered.getByText(/Software/i)).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(rendered.getByText("Archie"));
    });
    expect(
      rendered.getByLabelText(/Archie Access Based on/i)
    ).toBeInTheDocument();
    expect(
      rendered.getByLabelText(/Reporting Line Manager/i)
    ).toBeInTheDocument();
    expect(rendered.getByText(/Archie Manager/i)).toBeInTheDocument();
    expect(rendered.getByText(/Country Access/i)).toBeInTheDocument();
    expect(
      rendered.getByLabelText(/Additional comments for Archie/i)
    ).toBeInTheDocument();
    expect(
      rendered.queryByText(/Archie Analytics access based on/i)
    ).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.click(rendered.getByText("Archie Analytics"));
    });
    expect(
      rendered.getByLabelText(/Archie Analytics access based on/i)
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(rendered.getByText(/Banklink/i));
    });
    expect(rendered.getByText(/CHN \(CSA\/DSA\)/i)).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(rendered.getByText("Tableau"));
    });
    expect(rendered.getByText(/Tableau Access Type/i)).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(rendered.getByText("TeamViewer"));
    });
    expect(rendered.getByText(/TeamViewer License Type/i)).toBeInTheDocument();
    expect(rendered.getByText(/Phoenix/i)).toBeInTheDocument();
    const checkboxButtonOther = rendered.container.querySelector(
      "input[name='other'][type='checkbox']"
    );
    expect(
      rendered.queryByText(/Other software required/i)
    ).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.click(checkboxButtonOther);
    });
    expect(
      rendered.getByLabelText(/Other software required/i)
    ).toBeInTheDocument();
  });
});
