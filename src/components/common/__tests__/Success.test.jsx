import "@testing-library/jest-dom";

import React from "react";

import { render, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import Success from "../Success";

const replaceSpy = jest.fn();

describe("Success", () => {
  it("should render success message and go to dashboard given message", async () => {
    const { getByText } = render(
      <Router history={{ ...createMemoryHistory(), replace: replaceSpy }}>
        <Success
          location={{
            state: {
              messages: [
                "Departure form has been successfully submitted.",
                "To ensure smooth departure, please check your email and refer to the Employee Departure checklist link."
              ],
              button: {
                clickUrl: "/form/departure/list"
              }
            }
          }}
        />
      </Router>
    );
    expect(
      getByText("Departure form has been successfully submitted.", {
        exact: false
      })
    ).toBeInTheDocument();
    expect(
      getByText(
        "To ensure smooth departure, please check your email and refer to the Employee Departure checklist link.",
        { exact: false }
      )
    ).toBeInTheDocument();

    fireEvent.click(getByText("Go to Dashboard"));
    expect(replaceSpy).toHaveBeenCalledWith("/form/departure/list");
  });

  it("should render button text and click to redirect to url as is given button config", async () => {
    const { getByText } = render(
      <Router history={{ ...createMemoryHistory(), replace: replaceSpy }}>
        <Success
          location={{
            state: {
              messages: ["Successful"],
              button: {
                clickUrl: "/form/departure/list",
                text: "Check"
              }
            }
          }}
        />
      </Router>
    );

    fireEvent.click(getByText("Check"));
    expect(replaceSpy).toHaveBeenCalledWith("/form/departure/list");
  });

  it("should not render button given no button config", async () => {
    const { container } = render(
      <Router history={{ ...createMemoryHistory(), replace: replaceSpy }}>
        <Success
          location={{
            state: {
              messages: ["Successful"]
            }
          }}
        />
      </Router>
    );

    expect(container.querySelector(".flx-btn-row")).toBeNull();
  });
});
