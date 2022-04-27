import {
  Button,
  DatePicker,
  Dropdown,
  MoreIcon,
  PageHead,
  PageState,
  Pagination,
  Search,
  Select,
  Spinner,
  Table,
  Columns,
  Box
} from "@myob/myob-widgets";
import { format, startOfToday, addDays, addMonths, addWeeks } from "date-fns";
import { isNil } from "ramda";
import { useNavigate } from "react-router-dom";
import HttpStatus from "http-status-codes";
import React, { useCallback, useEffect, useState } from "react";

import { applySort, calculateTotalPages } from "../../../utils";
import {
  formatFormListResult,
  transformStartDateToNumber,
  transformFinishDateToNumber
} from "./utils/form";
import { getRoleUpdateForms } from "../../../apis/kilnBackendApis";
import { sort, tableColumns } from "./config";

const PAGE_SIZE = 20;
const DEFAULT_ACTIVE_SORT = { column: "effectiveDate", descending: false };
const ENTER_KEY_CODE = 13;
const FORM_STATUS = [
  "All Status",
  "Submitted",
  "Approved",
  "Contract Signed",
  "Cancelled"
];
const RANGE_ENUM = {
  ALL: {
    VALUE: "0",
    TYPE: "day",
    LABEL: "All Dates"
  },
  NEXT7DAYS: {
    VALUE: "7",
    TYPE: "day",
    LABEL: "Next 7 Days"
  },
  NEXT30DAYS: {
    VALUE: "30",
    TYPE: "day",
    LABEL: "Next 30 Days"
  },
  NEXT90DAYS: {
    VALUE: "90",
    TYPE: "day",
    LABEL: "Next 90 Days"
  },
  NEXT6MONTHS: {
    VALUE: "6",
    TYPE: "month",
    LABEL: "Next 6 Months"
  },
  CUSTOMRANGE: {
    VALUE: "",
    TYPE: "",
    LABEL: "Custom Range"
  }
};
const RANGE_STATUS = Object.values(RANGE_ENUM);
const ACTIONS = ["View"];
const ACCESS_DENIED_ERROR = [
  "Sorry, you do not have the permission to view role update request status."
];

export const determineStatusToRequest = activeStatus => {
  switch (activeStatus) {
    case "Submitted":
      return "UNEVALUATED,REOPENED";
    case "Cancelled":
      return "CANCELLED";
    case "Approved":
      return "APPROVED";
    case "Contract Signed":
      return "CONTRACT_SIGNED,CONTRACT_SKIPPED,ALL_SKIPPED";
    default:
      return "";
  }
};

const RoleUpdateDashboard = () => {
  const [activeSort, setActiveSort] = useState(DEFAULT_ACTIVE_SORT);
  const [activePage, setActivePage] = useState(1);
  const [activeStatus, setActiveStatus] = useState("All Status");
  const [searchBarContent, setSearchBarContent] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [finishDate, setFinishDate] = useState(null);
  const [startDateSearchKey, setStartDateSearchKey] = useState(null);
  const [finishDateSearchKey, setFinishDateSearchKey] = useState(null);
  const [rangeValue, setRangeValue] = useState("All Dates");
  const columns = tableColumns;
  const history = useNavigate();

  const onSort = column => {
    setActiveSort({ column, descending: !activeSort.descending });
    setActivePage(1);
    setFormData(applySort(formData, sort[column], !activeSort.descending));
  };

  const addDaysForPicker = (count, type) => {
    switch (type) {
      case "day":
        return format(addDays(startOfToday(), count), "yyyy-MM-dd");
      case "week":
        return format(addWeeks(startOfToday(), count), "yyyy-MM-dd");
      case "month":
        return format(addMonths(startOfToday(), count), "yyyy-MM-dd");
      default:
        break;
    }
  };

  const onRangeChange = pickedRangeValue => {
    setRangeValue(pickedRangeValue);
    switch (pickedRangeValue) {
      case RANGE_ENUM.ALL.LABEL:
        setStartDate("");
        setFinishDate("");
        break;
      case RANGE_ENUM.NEXT7DAYS.LABEL:
        setStartDate(addDaysForPicker(0, RANGE_ENUM.NEXT7DAYS.TYPE));
        setFinishDate(
          addDaysForPicker(
            RANGE_ENUM.NEXT7DAYS.VALUE,
            RANGE_ENUM.NEXT7DAYS.TYPE
          )
        );
        break;
      case RANGE_ENUM.NEXT30DAYS.LABEL:
        setStartDate(addDaysForPicker(0, RANGE_ENUM.NEXT30DAYS.TYPE));
        setFinishDate(
          addDaysForPicker(
            RANGE_ENUM.NEXT30DAYS.VALUE,
            RANGE_ENUM.NEXT30DAYS.TYPE
          )
        );
        break;
      case RANGE_ENUM.NEXT90DAYS.LABEL:
        setStartDate(addDaysForPicker(0, RANGE_ENUM.NEXT90DAYS.TYPE));
        setFinishDate(
          addDaysForPicker(
            RANGE_ENUM.NEXT90DAYS.VALUE,
            RANGE_ENUM.NEXT90DAYS.TYPE
          )
        );
        break;
      case RANGE_ENUM.NEXT6MONTHS.LABEL:
        setStartDate(addDaysForPicker(0, RANGE_ENUM.NEXT6MONTHS.TYPE));
        setFinishDate(
          addDaysForPicker(
            RANGE_ENUM.NEXT6MONTHS.VALUE,
            RANGE_ENUM.NEXT6MONTHS.TYPE
          )
        );
        break;
      default:
        break;
    }
  };

  const compareMaxStartDateWithPickedFinishDate = pickedFinishDate => {
    if (isNil(pickedFinishDate)) {
      // Arbitrarily allow dates up to 18 months in the future
      return addDaysForPicker(18, "month");
    } else {
      return pickedFinishDate;
    }
  };

  const onSwitchPage = page => setActivePage(page);

  const onSelectStatus = event => {
    setActiveStatus(event.target.value);
  };

  const onEnterKeyUp = event => {
    const { keyCode } = event;
    if (keyCode !== ENTER_KEY_CODE) {
      return;
    }
    setSearchKey(searchBarContent);
    setActivePage(1); // set the result page to page 1.
  };

  const clearDateRangePicker = () => {
    setStartDate("");
    setFinishDate("");
    setRangeValue("");
    setStartDateSearchKey("");
    setFinishDateSearchKey("");
  };

  const onClickClearSearch = () => {
    searchBarContent && setSearchBarContent("");
    setSearchKey("");
    clearDateRangePicker();
    setActiveSort(DEFAULT_ACTIVE_SORT);
    setActivePage(1); // set the result page to page 1.
    setActiveStatus(FORM_STATUS[0]);
  };

  const onClickSearch = () => {
    setActivePage(1); // set the result page to page 1.
    setSearchKey(searchBarContent);
    setStartDateSearchKey(transformStartDateToNumber(startDate));
    setFinishDateSearchKey(transformFinishDateToNumber(finishDate));
  };

  const onSelectMoreOptions = (event, selectedFormId) => {
    if (event === "View") {
      history(`/form/role-update/${selectedFormId}/preview`);
    }
  };

  const fetchForms = useCallback(async () => {
    setLoading(true);

    const resp = await getRoleUpdateForms({
      page: activePage,
      size: PAGE_SIZE,
      sortBy: activeSort.column,
      desc: activeSort.descending,
      status: determineStatusToRequest(activeStatus),
      search: searchKey,
      startDate: startDateSearchKey,
      finishDate: finishDateSearchKey
    });
    if (resp.status === HttpStatus.FORBIDDEN) {
      history("/form/role-update/access-denied", {
        replace: true,
        state: { errorMessages: ACCESS_DENIED_ERROR }
      });
      return;
    }
    const { data } = resp;
    setFormData(data.data.map(formatFormListResult));
    setTotal(data.total);
    setTotalPages(calculateTotalPages(data.total, PAGE_SIZE));
    setLoading(false);
  }, [
    activePage,
    activeSort.column,
    activeSort.descending,
    activeStatus,
    finishDateSearchKey,
    history,
    searchKey,
    startDateSearchKey
  ]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  return (
    <>
      <div>
        <PageHead title="Role Update Form Dashboard">
          <p className="sub-header">{total} Results</p>
          <Pagination
            pageCount={totalPages}
            activePage={activePage}
            onSelect={onSwitchPage}
          />
        </PageHead>
        <Columns>
          <Columns.Column span={["12", "12", "6", "5", "4"]}>
            <Box
              display="flex"
              alignContent="space-between"
              justifyContent="center"
            >
              <Box>
                <Select
                  name="status"
                  label="Status"
                  hideLabel
                  onChange={onSelectStatus}
                  disabled={loading}
                  className="status-select"
                  value={activeStatus}
                >
                  {FORM_STATUS.map(status => (
                    <Select.Option value={status} label={status} key={status} />
                  ))}
                </Select>
              </Box>
              <Box marginLeft="xs">
                <Search
                  name="search"
                  placeholder="Search Employee Name"
                  label="Search"
                  hideLabel
                  onChange={event => setSearchBarContent(event.target.value)}
                  onKeyUp={onEnterKeyUp}
                  value={searchBarContent}
                  disabled={loading}
                />
              </Box>
            </Box>
          </Columns.Column>
          <Columns.Column span={["12", "12", "6", "7", "8"]}>
            <Box display="flex" justifyContent="flex-end">
              <Box>
                <label className="form-label">Submitted Date</label>
                <Select
                  name="date-range"
                  label="Range"
                  hideLabel
                  value={rangeValue}
                  onChange={event => onRangeChange(event.target.value)}
                  disabled={loading}
                  className="range-select"
                >
                  {RANGE_STATUS.map(range => (
                    <Select.Option
                      value={range.LABEL}
                      label={range.LABEL}
                      key={range.LABEL}
                    />
                  ))}
                </Select>
              </Box>
              <Box marginLeft="xs">
                <label className="form-label">From</label>
                <DatePicker
                  className="date-picker"
                  name="start-date"
                  hideLabel
                  label="From"
                  width="sm"
                  max={compareMaxStartDateWithPickedFinishDate(finishDate)}
                  value={startDate}
                  disabled={loading}
                  onSelect={value => {
                    setStartDate(value.value);
                    setRangeValue("Custom Range");
                  }}
                />
              </Box>
              <Box marginLeft="xs">
                <label className="form-label">To</label>
                <DatePicker
                  className="date-picker"
                  name="finish-date"
                  hideLabel
                  label="To"
                  width="sm"
                  min={startDate}
                  max={addDaysForPicker(18, "month")}
                  value={finishDate}
                  disabled={loading}
                  onSelect={value => {
                    setFinishDate(value.value);
                    setRangeValue("Custom Range");
                  }}
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end" marginBottom="md">
              <Box>
                <Button
                  className="btn-search"
                  tone="success"
                  onClick={() => {
                    setSearchKey(searchBarContent);
                    onClickSearch();
                  }}
                  disabled={loading}
                >
                  Search
                </Button>
              </Box>
              <Box marginLeft="tiny">
                <Button
                  tone="neutral"
                  className="margin-left-05"
                  onClick={onClickClearSearch}
                  disabled={loading}
                >
                  Clear
                </Button>
              </Box>
            </Box>
          </Columns.Column>
        </Columns>
        {loading && (
          <PageState
            title="Loading..."
            description="Your data is on the way"
            image={<Spinner size="medium" />}
          ></PageState>
        )}
        <div className={loading ? "hidden" : "shown"}>
          <Table variant="card">
            <Table.Header>
              {columns.map(col => (
                <Table.HeaderItem
                  key={col.key}
                  sortName={activeSort.column}
                  sortDirection={
                    col.key === activeSort.column
                      ? activeSort.descending
                        ? "ascending"
                        : "descending"
                      : "unsorted"
                  }
                  onSort={() => onSort(col.key)}
                  align={col.align || (col.key === "number" && "right")}
                >
                  {col.description}
                </Table.HeaderItem>
              ))}
            </Table.Header>
            <Table.Body>
              {formData.map(datum => (
                <Table.Row key={datum.id}>
                  {columns.map(col => (
                    <Table.RowItem
                      columnName={col.description}
                      align={col.align || "left"}
                      key={`${datum.id}-${col.key}`}
                      textWrap="wrap"
                    >
                      {datum[col.key]}
                    </Table.RowItem>
                  ))}
                  <Table.RowItem width="auto" cellRole="actions" align="left">
                    <Dropdown
                      right
                      items={ACTIONS.map(action => (
                        <Dropdown.Item
                          key={action}
                          label={action}
                          value={action}
                        />
                      ))}
                      onSelect={e => onSelectMoreOptions(e, datum.id)}
                      toggle={
                        <Dropdown.Toggle aria-label="more options" size="xs">
                          <MoreIcon size="16px" />
                        </Dropdown.Toggle>
                      }
                    />
                  </Table.RowItem>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  );
};

export default RoleUpdateDashboard;
