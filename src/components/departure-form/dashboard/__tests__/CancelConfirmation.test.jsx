import "@testing-library/jest-dom/extend-expect";

import React from "react";
import mockAxios from "axios";

import { act, render, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import CancelConfirmation from "../CancelConfirmation";

const pushSpy = jest.fn();

const renderCancelConfirmation = () =>
  render(
    <Router history={{ ...createMemoryHistory(), push: pushSpy }}>
      <CancelConfirmation
        formId={1}
        onCancelDeparture={() => {}}
      ></CancelConfirmation>
    </Router>
  );

describe("Cancel confirmation page", () => {
  it("should cancel departure form", async () => {
    window.scroll = () => {};
    const { getByText, getByPlaceholderText } = renderCancelConfirmation();
    expect(getByText("Submit")).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(getByPlaceholderText("Please enter cancel reason"), {
        target: { value: "I want to cancel." }
      });
    });

    await act(async () => {
      fireEvent.click(getByText("Submit"));
    });

    expect(
      getByText("Do you really want to cancel the Departure Form?")
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(getByText("Yes"));
    });

    expect(mockAxios.patch).toHaveBeenCalledTimes(1);
  });
});
