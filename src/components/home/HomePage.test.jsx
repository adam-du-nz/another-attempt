import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";
import HomePage from "./HomePage";

describe("HomePage", () => {
  it("should render correctly", () => {
    const { getByText } = render(<HomePage />);
    expect(getByText("Employee Forms")).toBeInTheDocument();
    expect(getByText("Departure Request")).toBeInTheDocument();
    expect(getByText("Name Change Request")).toBeInTheDocument();
    expect(getByText("Role Update/Transfer Request")).toBeInTheDocument();
    expect(getByText("3rd Party Contractor Form")).toBeInTheDocument();
    expect(getByText("Parental Leave Form")).toBeInTheDocument();
    expect(
      getByText(
        "If you've got any questions or need help figuring out which is the correct form to use, please contact",
        { exact: false }
      )
    ).toBeInTheDocument();
  });
});
