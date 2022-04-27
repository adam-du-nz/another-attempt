import React from "react";
import "@testing-library/jest-dom/extend-expect";
import mockAxios from "axios";
import { act, screen, render, fireEvent } from "@testing-library/react";
import DepartureFormCreate from "../DepartureFormCreate";

const mockSearchUsers = users => {
  mockAxios.post = jest.fn().mockResolvedValue({ data: users });
};

const mockGetUsers = users => {
  mockAxios.get = jest.fn().mockResolvedValue({ data: users });
};

describe("Departure Form Create", () => {
  beforeEach(() => {
    mockSearchUsers([{ id: 1 }]);
    mockGetUsers([{ id: 1 }]);
  });

  it("should render card components", async () => {
    await act(async () => {
      render(<DepartureFormCreate></DepartureFormCreate>);
    });

    expect(screen.queryByText("Team Member Details")).toBeInTheDocument();
    expect(screen.queryByText("Departure Details")).toBeInTheDocument();
  });

  it("should render Team Member Details section", async () => {
    let rendered;
    await act(async () => {
      rendered = render(<DepartureFormCreate />);
    });
    expect(rendered.getByLabelText("Select team member *")).toBeInTheDocument();
    expect(rendered.getByLabelText("Position title")).toBeInTheDocument();
    expect(rendered.getByLabelText("Position title")).toBeDisabled();
    expect(rendered.getByLabelText("Function")).toBeInTheDocument();
    expect(rendered.getByLabelText("Function")).toBeDisabled();
    expect(rendered.getByLabelText("Group")).toBeInTheDocument();
    expect(rendered.getByLabelText("Group")).toBeDisabled();
    expect(rendered.getByLabelText("Department")).toBeInTheDocument();
    expect(rendered.getByLabelText("Department")).toBeDisabled();
    expect(rendered.getByLabelText("Team")).toBeInTheDocument();
    expect(rendered.getByLabelText("Team")).toBeDisabled();
    expect(rendered.getByLabelText("Vertical")).toBeInTheDocument();
    expect(rendered.getByLabelText("Vertical")).toBeDisabled();
    expect(rendered.getByLabelText("Location")).toBeInTheDocument();
    expect(rendered.getByLabelText("Location")).toBeDisabled();
  });

  it("should render Departure Details section", async () => {
    let rendered;
    await act(async () => {
      rendered = render(<DepartureFormCreate />);
    });
    expect(rendered.getByLabelText("Departure Reason *")).toBeInTheDocument();
    expect(
      rendered.getByLabelText("Last day in the office *")
    ).toBeInTheDocument();
    expect(
      rendered.getByLabelText("Last day of employment *")
    ).toBeInTheDocument();
    expect(
      rendered.getByLabelText("What is the impact of this departure *")
    ).toBeInTheDocument();
  });

  it("should show or hide impact when departure depending on selected departure reason", async () => {
    let rendered;
    await act(async () => {
      rendered = render(<DepartureFormCreate />);
    });
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Departure Reason *"), {
        target: { value: "Resignation" }
      });
    });
    expect(
      rendered.getByLabelText("What is the impact of this departure *")
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Departure Reason *"), {
        target: { value: "End of contract (fixed-term, casual or 3rd party)" }
      });
    });
    expect(
      rendered.queryByLabelText("What is the impact of this departure *")
    ).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Departure Reason *"), {
        target: { value: "Dismissal" }
      });
    });
    expect(
      rendered.getByLabelText("What is the impact of this departure *")
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Departure Reason *"), {
        target: { value: "Did not start" }
      });
    });
    expect(
      rendered.queryByLabelText("What is the impact of this departure *")
    ).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Departure Reason *"), {
        target: { value: "Redundancy" }
      });
    });
    expect(
      rendered.getByLabelText("What is the impact of this departure *")
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Departure Reason *"), {
        target: { value: "Deceased" }
      });
    });
    expect(
      rendered.queryByLabelText("What is the impact of this departure *")
    ).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Departure Reason *"), {
        target: { value: "Retirement" }
      });
    });
    expect(
      rendered.getByLabelText("What is the impact of this departure *")
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Departure Reason *"), {
        target: { value: "Abandonment" }
      });
    });
    expect(
      rendered.getByLabelText("What is the impact of this departure *")
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Departure Reason *"), {
        target: { value: "Other" }
      });
    });
    expect(rendered.queryByLabelText("Other")).toBeInTheDocument();
    expect(
      rendered.getByLabelText("What is the impact of this departure *")
    ).toBeInTheDocument();
  });

  it("should show attachment for resignation or retirement", async () => {
    let rendered;
    await act(async () => {
      rendered = render(<DepartureFormCreate />);
    });
    expect(
      rendered.queryByText("Upload Resignation Letter *")
    ).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Departure Reason *"), {
        target: { value: "Resignation" }
      });
    });
    expect(
      rendered.queryByText("Upload Resignation Letter *")
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Departure Reason *"), {
        target: { value: "Did not start" }
      });
    });
    expect(
      rendered.queryByText("Upload Resignation Letter *")
    ).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Departure Reason *"), {
        target: { value: "Retirement" }
      });
    });
    expect(
      rendered.queryByText("Upload Resignation Letter *")
    ).toBeInTheDocument();
  });
});
