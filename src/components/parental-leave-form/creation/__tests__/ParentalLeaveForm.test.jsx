import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react";
import { createMemoryHistory } from "history";
import selectEvent from "react-select-event";
import ParentalLeaveForm from "../ParentalLeaveForm";
import UserContext from "../../../../auth/UserContext";
// eslint-disable-next-line jest/no-mocks-import
// import mockAxios from "../../../../__mocks__/axios";
import mockAxios from "axios";
import { Router } from "react-router-dom";
import { format, addDays } from "date-fns";
const pushSpy = jest.fn();
beforeEach(() => {
  mockAxios.get = jest.fn().mockResolvedValue({
    status: 200,
    data: [
      {
        id: 1,
        userPrincipalName: "lin.chen@myob.com",
        firstName: "Lin",
        surname: "Chen",
        isADAccountEnabled: true,
        locationCountry: "New Zealand",
        payglobalUsername: "Lin.Chen",
        reportingManagerPayglobalUsername: "aFirst.aSurname",
      },
      {
        userPrincipalName: "a@myob.com",
        firstName: "aFirst",
        surname: "aSurname",
        isADAccountEnabled: true,
        locationCountry: "Australia",
        payglobalUsername: "aFirst.aSurname",
        reportingManagerPayglobalUsername: "",
      },
    ],
  });
});

describe("ParentalLeaveForm", () => {
  fit("should prefill user who logged in", async () => {
    let rendered;
    const navigatorHistory = createMemoryHistory();
    await act(async () => {
      rendered = render(
        <Router
          location={navigatorHistory.location}
          navigator={navigatorHistory}
        >
          <UserContext.Provider
            value={{
              id: 1,
            }}
          >
            <ParentalLeaveForm />
          </UserContext.Provider>
        </Router>
      );
    });
    expect(rendered.getByText("First Name")).toBeInTheDocument();
    expect(rendered.getByTestId("parentalLeaveForm")).toHaveFormValues({});
    expect(rendered.getByDisplayValue("Lin")).toBeInTheDocument();
    expect(rendered.getByDisplayValue("Chen")).toBeInTheDocument();
  });

  it("should change user when select others", async () => {
    let rendered;
    const navigatorHistory = createMemoryHistory();
    await act(async () => {
      rendered = render(
        <Router
          location={navigatorHistory.location}
          navigator={navigatorHistory}
        >
          <ParentalLeaveForm />
        </Router>
      );
    });
    await selectEvent.select(rendered.getByLabelText("Employee"), "a@myob.com");
    expect(rendered.getByDisplayValue("aFirst")).toBeInTheDocument();
    expect(rendered.getByDisplayValue("aSurname")).toBeInTheDocument();
  });

  it("should prompt user to select one type of parental leave", async () => {
    let rendered;
    const navigatorHistory = createMemoryHistory();
    await act(async () => {
      rendered = render(
        <Router
          location={navigatorHistory.location}
          navigator={navigatorHistory}
        >
          <ParentalLeaveForm />
        </Router>
      );
    });
    expect(
      rendered.getByLabelText("Type of Parental Leave")
    ).toBeInTheDocument();
    expect(rendered.getByLabelText("Type of Parental Leave")[1]).toHaveValue(
      "Primary Carer Leave"
    );
    expect(rendered.getByLabelText("Type of Parental Leave")[2]).toHaveValue(
      "Secondary Carer Leave"
    );
    expect(rendered.getByLabelText("Type of Parental Leave")[3]).toHaveValue(
      "Sharing Primary Carer Leave"
    );
    expect(rendered.getByLabelText("Type of Parental Leave")[4]).toHaveValue(
      "Surrogacy Leave"
    );
  });

  it("should display leave entitlement section when user selects a type of leave", async () => {
    let rendered;
    const navigatorHistory = createMemoryHistory();
    await act(async () => {
      rendered = render(
        <Router
          location={navigatorHistory.location}
          navigator={navigatorHistory}
        >
          <ParentalLeaveForm />
        </Router>
      );
    });

    fireEvent.change(rendered.getByLabelText("Type of Parental Leave"), {
      target: { value: "Primary Carer Leave" },
    });
    expect(
      rendered.getByText(
        "Are you considering using any leave entitlements in addition to your Parental Leave?"
      )
    ).toBeInTheDocument();
    fireEvent.click(rendered.getByText("Yes"));
    expect(
      rendered.getByLabelText("Start date of leave entitlements")
    ).toBeInTheDocument();
    expect(
      rendered.getByLabelText("End date of leave entitlements")
    ).toBeInTheDocument();
    fireEvent.click(rendered.getByText("No"));
    expect(
      rendered.queryByLabelText("Start date of leave entitlements")
    ).not.toBeInTheDocument();
    expect(
      rendered.queryByLabelText("End date of leave entitlements")
    ).not.toBeInTheDocument();
  });

  it("should display primary carer leave info when user selects primary carer leave", async () => {
    let rendered;
    const navigatorHistory = createMemoryHistory();
    await act(async () => {
      rendered = render(
        <Router
          location={navigatorHistory.location}
          navigator={navigatorHistory}
        >
          <ParentalLeaveForm />
        </Router>
      );
    });

    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Type of Parental Leave"), {
        target: { value: "Primary Carer Leave" },
      });
    });
    expect(
      rendered.getByLabelText("Start of Parental Leave")
    ).toBeInTheDocument();
    expect(
      rendered.getByLabelText("End of Parental Leave")
    ).toBeInTheDocument();
    expect(rendered.getByDisplayValue("Paid monthly")).toBeInTheDocument();
    expect(
      rendered.getByDisplayValue(
        "Paid in one lump sum in the monthly pay following the start of your leave"
      )
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(rendered.getByDisplayValue("Paid monthly"));
    });
    expect(
      rendered.getByText(
        "Please select the date you would like to commence your MYOB Paid Parental Leave"
      )
    ).toBeInTheDocument();
    fireEvent.click(
      rendered.getByDisplayValue(
        "Paid in one lump sum in the monthly pay following the start of your leave"
      )
    );
    expect(
      rendered.queryByText(
        "Please select the date you would like to commence your MYOB Paid Parental Leave"
      )
    ).not.toBeInTheDocument();
  });
  it("should display secondary carer leave info when user selects secondary carer leave", async () => {
    let rendered;
    const navigatorHistory = createMemoryHistory();
    await act(async () => {
      rendered = render(
        <Router
          location={navigatorHistory.location}
          navigator={navigatorHistory}
        >
          <ParentalLeaveForm />
        </Router>
      );
    });

    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Type of Parental Leave"), {
        target: { value: "Secondary Carer Leave" },
      });
    });
    expect(
      rendered.getByDisplayValue("Yes, continuous two week leave period")
    ).toBeInTheDocument();
    expect(
      rendered.getByDisplayValue("No, I want to break it up")
    ).toBeInTheDocument();
    expect(
      rendered.getByText("Will you be taking any unpaid parental leave?")
    ).toBeInTheDocument();
  });

  it("should display secondary carer leave info when user selects secondary carer leave with continuous two week leave period", async () => {
    let rendered;
    const navigatorHistory = createMemoryHistory();
    await act(async () => {
      rendered = render(
        <Router
          location={navigatorHistory.location}
          navigator={navigatorHistory}
        >
          <ParentalLeaveForm />
        </Router>
      );
    });

    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Type of Parental Leave"), {
        target: { value: "Secondary Carer Leave" },
      });
    });
    expect(
      rendered.getByDisplayValue("Yes, continuous two week leave period")
    ).toBeInTheDocument();
    expect(
      rendered.getByDisplayValue("No, I want to break it up")
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(
        rendered.getByDisplayValue("Yes, continuous two week leave period")
      );
    });
    expect(
      rendered.getByText(
        "Please select the date you would like to commence your MYOB Paid Parental Leave"
      )
    ).toBeInTheDocument();
    expect(
      rendered.queryByLabelText(
        "Please specify (in detail) the dates or pattern of dates for which you would like your paid leave applied:"
      )
    ).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.click(rendered.getByDisplayValue("No, I want to break it up"));
    });
    expect(
      rendered.getByLabelText(
        "Start Date of the First Week of Your Noncontinuous Paid Leave"
      )
    ).toBeInTheDocument();
    expect(
      rendered.getByLabelText(
        "Start Date of the Second Week of Your Noncontinuous Paid Leave"
      )
    ).toBeInTheDocument();
    expect(
      rendered.queryByLabelText(
        "Please select the date you would like to commence your MYOB Paid Parental Leave"
      )
    ).not.toBeInTheDocument();
  });

  it("should display sharing primary carer leave info when user selects Sharing Primary Carer Leave", async () => {
    let rendered;
    const navigatorHistory = createMemoryHistory();
    await act(async () => {
      rendered = render(
        <Router
          location={navigatorHistory.location}
          navigator={navigatorHistory}
        >
          <ParentalLeaveForm />
        </Router>
      );
    });

    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Type of Parental Leave"), {
        target: { value: "Sharing Primary Carer Leave" },
      });
    });
    expect(rendered.getByDisplayValue("Paid monthly")).toBeInTheDocument();
    expect(
      rendered.getByDisplayValue(
        "Paid in one lump sum in the monthly pay following the start of your leave"
      )
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(rendered.getByDisplayValue("Paid monthly"));
    });
    expect(
      rendered.getByText(
        "Please select the date you would like to commence your MYOB Paid Parental Leave"
      )
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(
        rendered.getByDisplayValue(
          "Paid in one lump sum in the monthly pay following the start of your leave"
        )
      );
    });
    expect(
      rendered.queryByText(
        "Please select the date you would like to commence your MYOB Paid Parental Leave"
      )
    ).not.toBeInTheDocument();
  });

  it("should display surrogacy leave info when user selects Surrogacy Leave", async () => {
    let rendered;
    const navigatorHistory = createMemoryHistory();
    await act(async () => {
      rendered = render(
        <Router
          location={navigatorHistory.location}
          navigator={navigatorHistory}
        >
          <ParentalLeaveForm />
        </Router>
      );
    });
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Type of Parental Leave"), {
        target: { value: "Surrogacy Leave" },
      });
    });
    expect(
      rendered.getByLabelText("Start of Parental Leave")
    ).toBeInTheDocument();
    expect(
      rendered.getByLabelText("End of Parental Leave")
    ).toBeInTheDocument();
  });

  it("should display nz employee-organisation contribution info when user selects an employee-organisation in nz", async () => {
    let rendered;
    const navigatorHistory = createMemoryHistory();
    act(() => {
      rendered = render(
        <Router
          location={navigatorHistory.location}
          navigator={navigatorHistory}
        >
          <UserContext.Provider
            value={{
              id: 1,
              firstName: "lin",
              surname: "chen",
              isADAccountEnabled: true,
              locationCountry: "New Zealand",
            }}
          >
            <ParentalLeaveForm />
          </UserContext.Provider>
        </Router>
      );
    });
    await waitFor(() => expect(mockAxios.get).toHaveBeenCalledTimes(1));
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Type of Parental Leave"), {
        target: { value: "Secondary Carer Leave" },
      });
    });
    expect(rendered.getByLabelText("KiwiSaver")).toBeInTheDocument();
    await selectEvent.select(rendered.getByLabelText("Employee"), "a@myob.com");
    expect(rendered.queryByLabelText("KiwiSaver")).not.toBeInTheDocument();
  });

  it("should render attachments when upload success and remove when click remove btn", async () => {
    let rendered;
    const navigatorHistory = createMemoryHistory();
    await act(async () => {
      rendered = render(
        <Router
          location={navigatorHistory.location}
          navigator={navigatorHistory}
        >
          <ParentalLeaveForm />
        </Router>
      );
    });

    mockAxios.post = jest
      .fn()
      .mockResolvedValue({ status: 201, data: { filename: "dummy.pdf" } });
    const file = new File(["dummy content"], "dummy.pdf", {
      type: "pdf",
    });
    const file2 = new File(["dummy content"], "dummy2.pdf", {
      type: "pdf",
    });
    const inputEl = rendered.container.querySelector("#fileInput");
    Object.defineProperty(inputEl, "files", {
      value: [file, file2],
    });

    await act(async () => {
      fireEvent.change(inputEl);
    });
    await waitFor(() => expect(mockAxios.post).toHaveBeenCalledTimes(2));

    expect(rendered.queryAllByText("dummy.pdf")).toHaveLength(1);
    expect(rendered.queryAllByText("dummy2.pdf")).toHaveLength(1);
    await act(async () => {
      fireEvent.click(rendered.container.querySelector(".remove-button"));
    });
    expect(rendered.queryAllByText("dummy.pdf")).toHaveLength(0);
    expect(rendered.queryAllByText("dummy2.pdf")).toHaveLength(1);
    await act(async () => {
      fireEvent.click(rendered.container.querySelector(".remove-button"));
    });
    expect(rendered.queryAllByText("dummy2.pdf")).toHaveLength(0);
  });

  it("should go to success page given parental leave form submitted successfully", async () => {
    let rendered;
    let container;
    let getByLabelText;
    let queryByText;
    mockAxios.post = jest
      .fn()
      .mockResolvedValueOnce({ status: 201, data: { filename: "dummy.pdf" } })
      .mockResolvedValueOnce({ status: 201 });
    const navigatorHistory = createMemoryHistory();
    await act(async () => {
      rendered = render(
        <Router
          location={navigatorHistory.location}
          navigator={navigatorHistory}
        >
          <UserContext.Provider
            value={{
              id: 1,
              firstName: "Lin",
              surname: "Chen",
              isADAccountEnabled: true,
              locationCountry: "Australia",
            }}
          >
            <ParentalLeaveForm />
          </UserContext.Provider>
        </Router>
      );
      container = rendered.container;
      getByLabelText = rendered.getByLabelText;
      queryByText = rendered.queryByText;
    });

    await act(async () => {
      fireEvent.change(getByLabelText("Type of Parental Leave"), {
        target: { value: "Surrogacy Leave" },
      });
    });

    const startOfParentalLeaveInput = container.querySelector(
      'input[name="startOfParentalLeave"]'
    );
    const endOfParentalLeaveInput = container.querySelector(
      'input[name="endOfParentalLeave"]'
    );
    await act(async () => {
      fireEvent.change(startOfParentalLeaveInput, {
        target: { value: format(addDays(Date.now(), 30), "yyyy-MM-dd") },
      });
      fireEvent.change(endOfParentalLeaveInput, {
        target: { value: format(addDays(Date.now(), 60), "yyyy-MM-dd") },
      });
    });

    await act(async () => {
      const fileInput = container.querySelector("#fileInput");
      const file = new File(["dummy content"], "dummy.pdf", {
        type: "pdf",
      });
      Object.defineProperty(fileInput, "files", {
        value: [file],
      });
      fireEvent.change(fileInput);
      await waitFor(() => expect(mockAxios.post).toHaveBeenCalledTimes(1));
    });

    await act(async () => {
      fireEvent.click(queryByText("Submit"));
    });
    expect(pushSpy).toHaveBeenCalledWith("/success", {
      messages: ["Parental leave form has been successfully submitted."],
    });
  });

  it("should go to error page with a back button given error occurred when submitting parental leave form", async () => {
    let rendered;
    let container;
    let getByLabelText;
    let queryByText;
    mockAxios.post = jest
      .fn()
      .mockResolvedValueOnce({ status: 201, data: { filename: "dummy.pdf" } })
      .mockResolvedValueOnce({ status: 500 });
    const navigatorHistory = createMemoryHistory();
    await act(async () => {
      rendered = render(
        <Router
          location={navigatorHistory.location}
          navigator={navigatorHistory}
        >
          <UserContext.Provider
            value={{
              id: 1,
              firstName: "Lin",
              surname: "Chen",
              isADAccountEnabled: true,
              locationCountry: "Australia",
            }}
          >
            <ParentalLeaveForm />
          </UserContext.Provider>
        </Router>
      );
      container = rendered.container;
      getByLabelText = rendered.getByLabelText;
      queryByText = rendered.queryByText;
    });

    await act(async () => {
      fireEvent.change(getByLabelText("Type of Parental Leave"), {
        target: { value: "Surrogacy Leave" },
      });
    });

    const startOfParentalLeaveInput = container.querySelector(
      'input[name="startOfParentalLeave"]'
    );
    const endOfParentalLeaveInput = container.querySelector(
      'input[name="endOfParentalLeave"]'
    );
    await act(async () => {
      fireEvent.change(startOfParentalLeaveInput, {
        target: { value: format(addDays(Date.now(), 30), "yyyy-MM-dd") },
      });
      fireEvent.change(endOfParentalLeaveInput, {
        target: { value: format(addDays(Date.now(), 60), "yyyy-MM-dd") },
      });
    });

    await act(async () => {
      const fileInput = container.querySelector("#fileInput");
      const file = new File(["dummy content"], "dummy.pdf", {
        type: "pdf",
      });
      Object.defineProperty(fileInput, "files", {
        value: [file],
      });
      fireEvent.change(fileInput);
      await waitFor(() => expect(mockAxios.post).toHaveBeenCalledTimes(1));
    });

    await act(async () => {
      fireEvent.click(queryByText("Submit"));
    });
    expect(pushSpy).toHaveBeenCalledWith("/error");
  });
});
