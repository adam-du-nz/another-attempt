import "@testing-library/jest-dom/extend-expect";

import { Router } from "react-router-dom";
import React from "react";
import mockAxios from "axios";

import { act, render, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";

import { tableColumns } from "../config";
import OnboardingDashboard, {
  determineStatusToRequest
} from "../OnboardingDashboard";

import UserContext from "../../../../auth/UserContext";

const prepareForms = () => [
  {
    id: 4,
    employeeName: "Hans M",
    positionTitle: "Developer",
    primaryOffice: "Sydney",
    submittedBy: "Ran Meng",
    submittedDate: "2020-03-02T13:25:41.167Z",
    startDate: "2020-04-02T13:25:41.167Z",
    status: "APPROVED"
  },
  {
    id: 5,
    employeeName: "Yo Mate",
    positionTitle: "Developer",
    primaryOffice: "Auckland",
    submittedBy: "Ran Lott",
    submittedDate: "2020-03-02T13:25:41.167Z",
    startDate: "2020-04-02T13:25:41.167Z",
    status: "CANCELLED"
  },
  {
    id: 6,
    employeeName: "Monti Grade",
    positionTitle: "Developer",
    primaryOffice: "Sydney",
    submittedBy: "Chris Le",
    submittedDate: "2020-03-02T13:25:41.167Z",
    startDate: "2020-04-02T13:25:41.167Z",
    status: "EMPLOYEE_STARTED"
  },
  {
    id: 7,
    employeeName: "Ella Smith",
    positionTitle: "Developer",
    primaryOffice: "Auckland",
    submittedBy: "Ruby Varg",
    submittedDate: "2020-03-02T13:25:41.167Z",
    startDate: "2020-04-02T13:25:41.167Z",
    status: "ONBOARDING"
  }
];

const pushSpy = jest.fn();

const renderOnboardingDashboard = (department = "default") =>
  render(
    <Router history={{ ...createMemoryHistory(), push: pushSpy }}>
      <UserContext.Provider value={{ department }}>
        <OnboardingDashboard match={{ params: {} }}></OnboardingDashboard>
      </UserContext.Provider>
    </Router>
  );

const mockSearchUsers = users => {
  mockAxios.post = jest.fn().mockResolvedValue({
    data: { ...users }
  });
};

describe("render OnboardingDashboard correctly", () => {
  it("should call /api/onboarding-forms with page 1 and size 20 and default sort by start date descending and show spinner when entering dashboard page", async () => {
    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      mockAxios.get = jest
        .fn()
        .mockResolvedValue({ data: { total: 32, data: prepareForms() } });
      const { getByText } = renderOnboardingDashboard();
      expect(getByText("Your data is on the way")).toBeInTheDocument();
    });

    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(
      "/api/onboarding-forms?desc=true&finishDate&page=1&search=&size=20&sortBy=startDate&startDate&status="
    );
  });

  it("should render Access Denied page when current user has no access to any user (not a manager or ES team member)", async () => {
    await act(async () => {
      mockAxios.get = jest.fn().mockResolvedValue({ status: 403 });
      const { getByText } = renderOnboardingDashboard();
      expect(getByText("Your data is on the way")).toBeInTheDocument();
    });

    expect(pushSpy).toHaveBeenCalledWith({
      pathname: "/form/onboarding/accessDenied",
      state: {
        errorMessages: [
          "Sorry, you do not have the permission to view onboarding request status."
        ]
      }
    });
  });

  it("should render Onboarding Dashboard when current user has access to users", async () => {
    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      mockAxios.get = jest
        .fn()
        .mockResolvedValue({ data: { total: 0, data: [] } });
      const { getByText } = renderOnboardingDashboard();
      expect(getByText("Onboarding Form Dashboard")).toBeInTheDocument();
    });
  });

  it("should render form table header", async () => {
    let headerCells;

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      mockAxios.get = jest
        .fn()
        .mockResolvedValue({ data: { total: 32, data: prepareForms() } });
      const { container } = renderOnboardingDashboard();
      headerCells = container.querySelectorAll(
        ".table-data__header .table-data__cell"
      );
    });

    expect(headerCells).toBeTruthy();
    expect(headerCells.length).toBe(7);
    expect(headerCells[0]).toContainHTML("Employee Name");
    expect(headerCells[1]).toContainHTML("Position Title");
    expect(headerCells[2]).toContainHTML("Primary Office");
    expect(headerCells[3]).toContainHTML("Submitted By");
    expect(headerCells[4]).toContainHTML("Submitted Date");
    expect(headerCells[5]).toContainHTML("Start Date");
    expect(headerCells[6]).toContainHTML("Status");
  });

  it("should render form table data", async () => {
    let container;

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      mockAxios.get = jest
        .fn()
        .mockResolvedValue({ data: { total: 45, data: prepareForms() } });
      const rendered = renderOnboardingDashboard();
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
      const { getByText } = renderOnboardingDashboard();
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
      const rendered = renderOnboardingDashboard();
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
      const { container, getByText } = renderOnboardingDashboard();
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
        const rendered = renderOnboardingDashboard();
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
        `/api/onboarding-forms?desc=false&finishDate&page=1&search=&size=20&sortBy=${key}&startDate&status=`
      );
      expect(mockAxios.get).toHaveBeenNthCalledWith(
        3,
        `/api/onboarding-forms?desc=true&finishDate&page=1&search=&size=20&sortBy=${key}&startDate&status=`
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
      getByText = renderOnboardingDashboard().getByText;
    });

    await act(async () => {
      fireEvent.click(getByText("2"));
    });

    expect(mockAxios.get).toHaveBeenNthCalledWith(
      2,
      `/api/onboarding-forms?desc=true&finishDate&page=2&search=&size=20&sortBy=startDate&startDate&status=`
    );
    await act(async () => {
      fireEvent.click(getByText("Employee Name", { selector: "button" }));
    });
    expect(mockAxios.get).toHaveBeenNthCalledWith(
      3,
      `/api/onboarding-forms?desc=false&finishDate&page=1&search=&size=20&sortBy=employeeName&startDate&status=`
    );
  });

  it.each(["All Status", "Approved", "Cancelled", "Employee Started"])(
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
        const { container } = renderOnboardingDashboard();
        statusSelect = container.querySelector(".status-select");
      });

      await act(async () => {
        fireEvent.change(statusSelect, { target: { value: status } });
      });

      expect(mockAxios.get).toHaveBeenNthCalledWith(
        2,
        `/api/onboarding-forms?desc=true&finishDate&page=1&search=&size=20&sortBy=startDate&startDate&status=${determineStatusToRequest(
          status
        )}`
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
      const { container } = renderOnboardingDashboard();
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
      "/api/onboarding-forms?desc=true&finishDate&page=1&search=&size=20&sortBy=startDate&startDate&status="
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
      const { container } = renderOnboardingDashboard();
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
      queryByPlaceholderText = renderOnboardingDashboard()
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
      "/api/onboarding-forms?desc=true&finishDate&page=1&search=Hans&size=20&sortBy=startDate&startDate&status="
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
      queryByPlaceholderText = renderOnboardingDashboard()
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
      const rendered = renderOnboardingDashboard();
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
      "/api/onboarding-forms?desc=true&finishDate&page=1&search=&size=20&sortBy=startDate&startDate&status="
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
      queryByText = renderOnboardingDashboard().queryByText;
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
      const rendered = renderOnboardingDashboard();
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
      "/api/onboarding-forms?desc=true&finishDate=1585825199999&page=1&search=&size=20&sortBy=startDate&startDate=1577962800000&status="
    );
  });
});

describe("when form results not exist", () => {
  it("should render no data", async () => {
    let container;

    await act(async () => {
      mockSearchUsers([{ id: 1 }]);
      mockAxios.get = jest
        .fn()
        .mockResolvedValue({ data: { total: 0, data: [] } });
      const rendered = renderOnboardingDashboard();
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
      const { getByText } = renderOnboardingDashboard();
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
      const rendered = renderOnboardingDashboard();
      container = rendered.container;
    });

    const paginationButtons = container.querySelectorAll(".myob-pagination li");
    expect(paginationButtons.length).toBe(0);
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
