import "@testing-library/jest-dom";

import React from "react";

import { render, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import Error from "../Error";

describe("Error", () => {
  it("should render default error page with back button and Help Me text given no error message or button config", async () => {
    const history = createMemoryHistory();
    history("/form/departure");

    const { getByText } = render(
      <Router history={history}>
        <Error />
      </Router>
    );
    expect(
      getByText(
        "We've encountered an error. Please check back again later. If the issue persists, please submit a Help Me ticket",
        { exact: false }
      )
    ).toBeInTheDocument();
    expect(getByText("here")).toBeInTheDocument();
    expect(getByText("Back")).toBeInTheDocument();

    fireEvent.click(getByText("Back"));
    expect(history.action).toBe("POP"); // back to last page
  });

  it("should render error message as is given error message", async () => {
    const { getByText } = render(
      <Router history={createMemoryHistory()}>
        <Error location={{ state: { messages: ["Test message."] } }} />
      </Router>
    );
    expect(getByText("Test message", { exact: false })).toBeInTheDocument();
  });

  it("should render button with text to go to specific link given button config", async () => {
    const history = createMemoryHistory();
    history("/form/departure");

    const { getByText } = render(
      <Router history={history}>
        <Error
          location={{
            state: {
              button: {
                text: "Go to Dashboard",
                clickUrl: "/form/departure/list"
              }
            }
          }}
        />
      </Router>
    );
    expect(getByText("Go to Dashboard")).toBeInTheDocument();

    fireEvent.click(getByText("Go to Dashboard"));
    expect(history.action).toBe("REPLACE");
    expect(history.location.pathname).toBe("/form/departure/list");
  });

  it("should render without Help Me text given hide Help Me ticket text", () => {
    const { queryByText } = render(
      <Router history={createMemoryHistory()}>
        <Error
          location={{
            state: { messages: ["Error msg"], hideHelpMeTicketText: true }
          }}
        />
      </Router>
    );
    expect(queryByText("here")).toBeNull();
  });
});
