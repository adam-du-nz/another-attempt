import React from "react";
import { render } from "@testing-library/react";
import CardWithLoadingStatus from "../CardWithLoadingStatus";

describe("CardWithLoadingStatus", () => {
  it("should render correctly", () => {
    render(<CardWithLoadingStatus />);
  });
});
