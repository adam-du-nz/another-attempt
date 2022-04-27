import "@testing-library/jest-dom/extend-expect";

import { Router } from "react-router-dom";
import { startOfToday, format, addBusinessDays } from "date-fns";
import React from "react";
import mockAxios from "axios";

import { act, render, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";

import { tableColumns } from "../config";
import DepartureDashboard from "../DepartureDashboard";
import UserContext from "../../../../auth/UserContext";

const prepareForms = () => [
  {
    id: 4,
    employeeName: "Hans M",
    submittedBy: "Ran Meng",
    lastDayInTheOffice: "20500529",
    newManager: "Midlevel Manager",
    submittedDate: "2020-04-02T13:25:41.167Z",
    updatedAt: "2020-04-02T13:25:41.167Z",
    updatedByFullName: "Rodrigo Villarreal",
    status: "PROCESSING"
  },
  {
    id: 5,
    employeeName: "Yo Mate",
    submittedBy: "Ran Meng",
    lastDayInTheOffice: "20200529",
    newManager: "Midlevel Manager",
    submittedDate: "2020-04-02T08:27:51.330Z",
    updatedAt: "2020-04-02T13:25:41.167Z",
    updatedByFullName: "Rodrigo Villarreal",
    status: "CANCELLED"
  },
  {
    id: 6,
    employeeName: "Monti Grade",
    submittedBy: "Possum Patrol",
    lastDayInTheOffice: "20200321",
    newManager: "",
    submittedDate: "2020-01-03T15:27:01.023Z",
    updatedAt: "2020-04-02T13:25:41.167Z",
    updatedByFullName: "",
    status: "COMPLETED"
  },
  {
    id: 7,
    employeeName: "Wei Jia",
    submittedBy: "Possum Patrol",
    lastDayInTheOffice: format(addBusinessDays(startOfToday(), 2), "yyyyMMdd"),
    newManager: "",
    submittedDate: "2020-01-03T15:27:01.023Z",
    updatedAt: "2020-04-02T13:25:41.167Z",
    updatedByFullName: "",
    status: "PROCESSING"
  }
];

const pushSpy = jest.fn();

const renderDepartureDashboard = (department = "default") =>
  render(
    <Router history={{ ...createMemoryHistory(), push: pushSpy }}>
      <UserContext.Provider value={{ department }}>
        <DepartureDashboard match={{ params: {} }}></DepartureDashboard>
      </UserContext.Provider>
    </Router>
  );

const mockSearchUsers = users => {
  mockAxios.post = jest.fn().mockResolvedValue({
    data: { ...users }
  });
};

describe("render DepartureDashboard correctly", () => {
  it("should call /api/departure-forms with page 1 and size 20 and default sort by submitted date descending and show spinner when entering dashboard page", async () => {
    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      mockAxios.get = jest
        .fn()
        .mockResolvedValue({ data: { total: 32, data: prepareForms() } });
      const { getByText } = renderDepartureDashboard();
      expect(getByText("Your data is on the way")).toBeInTheDocument();
    });

    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(
      "/api/departure-forms?desc=true&finishDate&page=1&search=&size=20&sortBy=submittedDate&startDate&status="
    );
  });

  it("should render Access Denied page when current user has no access to any user (not a manager or ES team member)", async () => {
    await act(async () => {
      mockAxios.get = jest.fn().mockResolvedValue({ status: 403 });
      const { getByText } = renderDepartureDashboard();
      expect(getByText("Your data is on the way")).toBeInTheDocument();
    });

    expect(pushSpy).toHaveBeenCalledWith({
      pathname: "/form/departure/accessDenied",
      state: {
        errorMessages: [
          "Sorry, you do not have the permission to view departure request status."
        ]
      }
    });
  });

  it("should render Departure Dashboard when current user has access to users", async () => {
    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      mockAxios.get = jest
        .fn()
        .mockResolvedValue({ data: { total: 0, data: [] } });
      const { getByText } = renderDepartureDashboard();
      expect(getByText("Departure Form Dashboard")).toBeInTheDocument();
    });
  });

  it("should render form table header", async () => {
    let headerCells;

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      mockAxios.get = jest
        .fn()
        .mockResolvedValue({ data: { total: 32, data: prepareForms() } });
      const { container } = renderDepartureDashboard();
      headerCells = container.querySelectorAll(
        ".table-data__header .table-data__cell"
      );
    });

    expect(headerCells).toBeTruthy();
    expect(headerCells.length).toBe(6);
    expect(headerCells[0]).toContainHTML("Employee Name");
    expect(headerCells[1]).toContainHTML("Submitted By");
    expect(headerCells[2]).toContainHTML("Last Day");
    expect(headerCells[3]).toContainHTML("New Manager");
    expect(headerCells[4]).toContainHTML("Submitted Date");
    expect(headerCells[5]).toContainHTML("Status");
  });

  it("should render form table data", async () => {
    let container;

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      mockAxios.get = jest
        .fn()
        .mockResolvedValue({ data: { total: 45, data: prepareForms() } });
      const rendered = renderDepartureDashboard();
      container = rendered.container;
    });

    const tableDataRows = container.querySelectorAll(
      ".table-data__body .table-data__row"
    );
    expect(tableDataRows.length).toBe(4);
  });

  it("should render results count", async () => {
    let getByTextFunc;

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      mockAxios.get = jest
        .fn()
        .mockResolvedValue({ data: { total: 45, data: prepareForms() } });
      const { getByText } = renderDepartureDashboard();
      getByTextFunc = getByText;
    });

    expect(getByTextFunc("45 Results")).toBeInTheDocument();
  });

  it("should render 3 pagination when 45 results in total", async () => {
    let container;

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      mockAxios.get = jest
        .fn()
        .mockResolvedValue({ data: { total: 45, data: prepareForms() } });
      const rendered = renderDepartureDashboard();
      container = rendered.container;
    });

    const paginationButtons = container.querySelectorAll(".myob-pagination li");
    expect(paginationButtons).toBeTruthy();
    expect(paginationButtons.length).toBe(3);
  });

  it("should show view link when click more", async () => {
    let optionButtons;
    let getByTextFunc;
    mockAxios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: { total: 4, data: prepareForms() } });

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      const { container, getByText } = renderDepartureDashboard();
      optionButtons = container.getElementsByClassName(
        "btn btn-default btn-xs dropdown-toggle"
      );
      getByTextFunc = getByText;
    });

    await act(async () => {
      fireEvent.click(optionButtons[0]);
    });

    expect(getByTextFunc("View")).toBeInTheDocument();
  });

  it("should cancel departure form as admin", async () => {
    let getByTextFunc;
    let container;
    let getByPlaceholderText;
    mockAxios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: { total: 4, data: prepareForms() } });

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      const rendered = renderDepartureDashboard("People Consulting");
      getByTextFunc = rendered.getByText;
      getByPlaceholderText = rendered.getByPlaceholderText;
      container = rendered.container;
    });

    const optionButtons = container.getElementsByClassName(
      "btn btn-default btn-xs dropdown-toggle"
    );

    await act(async () => {
      fireEvent.click(optionButtons[0]);
    });

    expect(getByTextFunc("Cancel")).toBeInTheDocument();
    expect(getByTextFunc("Cancel").closest("li")).not.toHaveClass("disabled");

    await act(async () => {
      fireEvent.click(getByTextFunc("Cancel"));
    });

    expect(
      getByPlaceholderText("Please enter cancel reason")
    ).toBeInTheDocument();
  });

  it("should disable cancel and edit button when departure process is CANCELLED.", async () => {
    let getByTextFunc;
    let container;
    mockAxios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: { total: 4, data: prepareForms() } });

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      const rendered = renderDepartureDashboard();
      getByTextFunc = rendered.getByText;
      container = rendered.container;
    });

    const tableDataRows = container.querySelectorAll(
      ".table-data__body .table-data__row"
    );
    const optionButtons = container.getElementsByClassName(
      "btn btn-default btn-xs dropdown-toggle"
    );

    await act(async () => {
      fireEvent.click(optionButtons[1]);
    });

    expect(getByTextFunc("Cancel")).toBeInTheDocument();
    expect(getByTextFunc("Cancel").closest("li")).toHaveClass("disabled");
    expect(getByTextFunc("Edit")).toBeInTheDocument();
    expect(getByTextFunc("Edit").closest("li")).toHaveClass("disabled");
    expect(tableDataRows[1]).toContainHTML("Yo Mate");
  });

  it("should disable cancel and edit button when departure process is COMPLETED.", async () => {
    let getByTextFunc;
    let container;
    mockAxios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: { total: 4, data: prepareForms() } });

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      const rendered = renderDepartureDashboard();
      getByTextFunc = rendered.getByText;
      container = rendered.container;
    });

    const tableDataRows = container.querySelectorAll(
      ".table-data__body .table-data__row"
    );
    const optionButtons = container.getElementsByClassName(
      "btn btn-default btn-xs dropdown-toggle"
    );

    await act(async () => {
      fireEvent.click(optionButtons[2]);
    });

    expect(getByTextFunc("Cancel")).toBeInTheDocument();
    expect(getByTextFunc("Cancel").closest("li")).toHaveClass("disabled");
    expect(getByTextFunc("Edit")).toBeInTheDocument();
    expect(getByTextFunc("Edit").closest("li")).toHaveClass("disabled");
    expect(tableDataRows[2]).toContainHTML("Monti Grade");
  });

  it("should disable cancel and Edit button when it is within two days of lastDayInTheOffice", async () => {
    let getByTextFunc;
    let container;
    mockAxios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: { total: 4, data: prepareForms() } });

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      const rendered = renderDepartureDashboard();
      getByTextFunc = rendered.getByText;
      container = rendered.container;
    });

    const tableDataRows = container.querySelectorAll(
      ".table-data__body .table-data__row"
    );
    const optionButtons = container.getElementsByClassName(
      "btn btn-default btn-xs dropdown-toggle"
    );

    await act(async () => {
      fireEvent.click(optionButtons[3]);
    });

    expect(getByTextFunc("Cancel")).toBeInTheDocument();
    expect(getByTextFunc("Cancel").closest("li")).toHaveClass("disabled");
    expect(getByTextFunc("Edit")).toBeInTheDocument();
    expect(getByTextFunc("Edit").closest("li")).toHaveClass("disabled");
    expect(tableDataRows[3]).toContainHTML("Wei Jia");
  });

  it("should not disable edit button for ES team even if it is within two days of lastDayInTheOffice", async () => {
    let getByTextFunc;
    let container;
    mockAxios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: { total: 4, data: prepareForms() } });

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      const rendered = renderDepartureDashboard("people consulting");
      getByTextFunc = rendered.getByText;
      container = rendered.container;
    });

    const tableDataRows = container.querySelectorAll(
      ".table-data__body .table-data__row"
    );
    const optionButtons = container.getElementsByClassName(
      "btn btn-default btn-xs dropdown-toggle"
    );

    await act(async () => {
      fireEvent.click(optionButtons[3]);
    });

    expect(getByTextFunc("Cancel")).toBeInTheDocument();
    expect(getByTextFunc("Cancel").closest("li")).not.toHaveClass("disabled");
    expect(getByTextFunc("Edit")).toBeInTheDocument();
    expect(getByTextFunc("Edit").closest("li")).not.toHaveClass("disabled");
    expect(tableDataRows[3]).toContainHTML("Wei Jia");
  });

  it("should disable View button for HelpDesk staff", async () => {
    let getByTextFunc;
    let container;
    mockAxios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: { total: 4, data: prepareForms() } });

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      const rendered = renderDepartureDashboard("EE HelpDesk");
      getByTextFunc = rendered.getByText;
      container = rendered.container;
    });
    const optionButtons = container.getElementsByClassName(
      "btn btn-default btn-xs dropdown-toggle"
    );
    await act(async () => {
      fireEvent.click(optionButtons[3]);
    });
    expect(getByTextFunc("View")).toBeInTheDocument();
    expect(getByTextFunc("View").closest("li")).toHaveClass("disabled");
  });
});

describe("when there are no form results", () => {
  it("should render no data", async () => {
    let container;

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      mockAxios.get = jest
        .fn()
        .mockResolvedValue({ data: { total: 0, data: [] } });
      const rendered = renderDepartureDashboard();
      container = rendered.container;
    });

    const tableDataRows = container.querySelectorAll(
      ".table-data__body .table-data__row"
    );
    expect(tableDataRows.length).toBe(0);
  });

  it("should render results count as 0", async () => {
    let getByTextFunc;

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      mockAxios.get = jest
        .fn()
        .mockResolvedValue({ data: { total: 0, data: [] } });
      const { getByText } = renderDepartureDashboard();
      getByTextFunc = getByText;
    });

    expect(getByTextFunc("0 Results")).toBeInTheDocument();
  });

  it("should not render pagination", async () => {
    let container;

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      mockAxios.get = jest
        .fn()
        .mockResolvedValue({ data: { total: 0, data: [] } });
      const rendered = renderDepartureDashboard();
      container = rendered.container;
    });

    const paginationButtons = container.querySelectorAll(".myob-pagination li");
    expect(paginationButtons.length).toBe(0);
  });
});

describe("should call API", () => {
  it.each(tableColumns.map(col => [col.key, col.description]))(
    "should call API to fetch sorted data by %s when sorting is clicked on %s",
    async (key, description) => {
      let getByText;
      mockAxios.get = jest
        .fn()
        .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } })
        .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } })
        .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } });

      await act(async () => {
        mockSearchUsers([{ id: 1 }]);
        const rendered = renderDepartureDashboard();
        getByText = rendered.getByText;
      });

      await act(async () => {
        fireEvent.click(getByText(description, { selector: "button" }));
      });

      await act(async () => {
        fireEvent.click(getByText(description, { selector: "button" }));
      });

      expect(mockAxios.get).toHaveBeenNthCalledWith(
        2,
        `/api/departure-forms?desc=false&finishDate&page=1&search=&size=20&sortBy=${key}&startDate&status=`
      );
      expect(mockAxios.get).toHaveBeenNthCalledWith(
        3,
        `/api/departure-forms?desc=true&finishDate&page=1&search=&size=20&sortBy=${key}&startDate&status=`
      );
    }
  );

  it("should call API to fetch next page when page 2 is clicked in pagination and back to page 1 when sort is clicked", async () => {
    let getByText;
    mockAxios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } })
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } })
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } });

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      getByText = renderDepartureDashboard().getByText;
    });

    await act(async () => {
      fireEvent.click(getByText("2"));
    });

    expect(mockAxios.get).toHaveBeenNthCalledWith(
      2,
      `/api/departure-forms?desc=true&finishDate&page=2&search=&size=20&sortBy=submittedDate&startDate&status=`
    );
    await act(async () => {
      fireEvent.click(getByText("Employee Name", { selector: "button" }));
    });
    expect(mockAxios.get).toHaveBeenNthCalledWith(
      3,
      `/api/departure-forms?desc=false&finishDate&page=1&search=&size=20&sortBy=employeeName&startDate&status=`
    );
  });

  it.each(["All Status", "Processing", "Cancelled", "Completed"])(
    "should call API to fetch forms with status [%s] when status is selected",
    async status => {
      status = status === "All Status" ? "" : status;
      let statusSelect;
      mockAxios.get = jest
        .fn()
        .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } })
        .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } });

      await act(async () => {
        mockSearchUsers([{ id: 1 }]);
        const { container } = renderDepartureDashboard();
        statusSelect = container.querySelector(".status-select");
      });

      await act(async () => {
        fireEvent.change(statusSelect, { target: { value: status } });
      });

      expect(mockAxios.get).toHaveBeenNthCalledWith(
        2,
        `/api/departure-forms?desc=true&finishDate&page=1&search=&size=20&sortBy=submittedDate&startDate&status=${status}`
      );
    }
  );

  it("should call API to fetch forms with all status when status is resumed to All Status", async () => {
    let statusSelect;
    mockAxios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } })
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } })
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } });

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      const { container } = renderDepartureDashboard();
      statusSelect = container.querySelector(".status-select");
    });

    await act(async () => {
      fireEvent.change(statusSelect, { target: { value: "Cancelled" } });
    });

    await act(async () => {
      fireEvent.change(statusSelect, { target: { value: "" } });
    });

    expect(mockAxios.get).toHaveBeenNthCalledWith(
      3,
      "/api/departure-forms?desc=true&finishDate&page=1&search=&size=20&sortBy=submittedDate&startDate&status="
    );
  });

  it("should not trigger form fetch when status is not changed", async () => {
    let statusSelect;
    mockAxios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } })
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } });

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      const { container } = renderDepartureDashboard();
      statusSelect = container.querySelector(".status-select");
    });

    await act(async () => {
      fireEvent.change(statusSelect, { target: { value: "Cancelled" } });
    });

    await act(async () => {
      fireEvent.change(statusSelect, { target: { value: "Cancelled" } });
    });

    expect(mockAxios.get).toHaveBeenCalledTimes(2);
  });

  it("should call API to search form when contents entered in search bar and Enter key pressed", async () => {
    let queryByPlaceholderText;
    mockAxios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } })
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } });

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      queryByPlaceholderText = renderDepartureDashboard()
        .queryByPlaceholderText;
    });

    await act(async () => {
      fireEvent.change(queryByPlaceholderText("Search Employee Name"), {
        target: { value: "Hans" }
      });
    });

    await act(async () => {
      fireEvent.keyUp(queryByPlaceholderText("Search Employee Name"), {
        keyCode: "13"
      });
    });

    expect(queryByPlaceholderText("Search Employee Name")).toHaveValue("Hans");
    expect(mockAxios.get).toHaveBeenNthCalledWith(
      2,
      "/api/departure-forms?desc=true&finishDate&page=1&search=Hans&size=20&sortBy=submittedDate&startDate&status="
    );
  });

  it("should not search form when no content in search bar and Enter key pressed", async () => {
    let queryByPlaceholderText;
    mockAxios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } })
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } });

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      queryByPlaceholderText = renderDepartureDashboard()
        .queryByPlaceholderText;
    });

    await act(async () => {
      fireEvent.keyUp(queryByPlaceholderText("Search Employee Name"), {
        keyCode: "13"
      });
    });

    expect(mockAxios.get).toHaveBeenCalledTimes(1);
  });

  it("should call API to fetch all forms when search bar content is cleared and Enter key is pressed", async () => {
    let queryByPlaceholderText;
    let queryByText;
    mockAxios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } })
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } })
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } })
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } });

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      const rendered = renderDepartureDashboard();
      queryByPlaceholderText = rendered.queryByPlaceholderText;
      queryByText = rendered.queryByText;
    });

    await act(async () => {
      fireEvent.change(queryByPlaceholderText("Search Employee Name"), {
        target: { value: "Hans" }
      });
    });

    await act(async () => {
      fireEvent.keyUp(queryByPlaceholderText("Search Employee Name"), {
        keyCode: "13"
      });
    });

    await act(async () => {
      fireEvent.click(queryByText("Clear"));
    });

    expect(mockAxios.get).toHaveBeenNthCalledWith(
      1,
      "/api/departure-forms?desc=true&finishDate&page=1&search=&size=20&sortBy=submittedDate&startDate&status="
    );
  });

  it("should not fetch forms when search bar is empty and Clear is clicked", async () => {
    let queryByText;
    mockAxios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } })
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } });

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      queryByText = renderDepartureDashboard().queryByText;
    });

    await act(async () => {
      fireEvent.click(queryByText("Clear"));
    });

    expect(mockAxios.get).toHaveBeenCalledTimes(2);
  });

  it("should call API to filter forms on the date rage entered in the date picker(s) and the Search button is pressed", async () => {
    let getByLabelText;
    let container;
    let getByRole;
    mockAxios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } })
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } })
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } })
      .mockResolvedValueOnce({ data: { total: 45, data: prepareForms() } });

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      const rendered = renderDepartureDashboard();
      getByLabelText = rendered.getByLabelText;
      getByRole = rendered.getByRole;
      container = rendered.container;
    });

    await act(async () => {
      // input start date
      fireEvent.change(getByLabelText(/From/i), {
        target: { value: "03/01/2020" }
      });
      // input finish date
      fireEvent.change(getByLabelText(/To/i), {
        target: { value: "02/04/2020" }
      });
    });

    await act(async () => {
      fireEvent.click(getByRole("button", { name: "Search" }));
    });

    await act(async () => {
      fireEvent.click(getByRole("button", { name: "Clear" }));
    });

    const tableDataRows = container.querySelectorAll(
      ".table-data__body .table-data__row"
    );
    expect(tableDataRows.length).toBe(4);
    expect(mockAxios.get).toHaveBeenNthCalledWith(
      2,
      "/api/departure-forms?desc=true&finishDate=1585825199999&page=1&search=&size=20&sortBy=submittedDate&startDate=1577962800000&status="
    );
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
