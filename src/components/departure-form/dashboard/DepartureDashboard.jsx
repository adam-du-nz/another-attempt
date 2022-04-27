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
import {
  addBusinessDays,
  format,
  startOfToday,
  subDays,
  subMonths,
  subWeeks
} from "date-fns";
import { isNil } from "ramda";
import { useNavigate } from "react-router-dom";
import HttpStatus from "http-status-codes";
import React, { useContext, useCallback, useEffect, useState } from "react";

import { applySort, calculateTotalPages, compareDate } from "../../../utils";
import {
  formatFormListResult,
  transformStartDateToNumber,
  transformFinishDateToNumber
} from "./utils/form";
import { getForms } from "../../../apis/kilnBackendApis";
import { sort, tableColumns } from "./config";
import CancelConfirmation from "./CancelConfirmation";
import UserContext from "../../../auth/UserContext";
import UserFactory from "../../../factories/UserFactory";
import CardWithLoadingStatus from "../../common/CardWithLoadingStatus";

const PAGE_SIZE = 20;
const DEFAULT_ACTIVE_SORT = { column: "submittedDate", descending: true };
const ENTER_KEY_CODE = 13;
const FORM_STATUS = ["All Status", "Processing", "Cancelled", "Completed"];
const RANGE_ENUM = {
  ALL: {
    VALUE: "0",
    TYPE: "day",
    LABEL: "All Dates"
  },
  LAST7DAYS: {
    VALUE: "7",
    TYPE: "day",
    LABEL: "Last 7 Days"
  },
  LAST30DAYS: {
    VALUE: "30",
    TYPE: "day",
    LABEL: "Last 30 Days"
  },
  LAST90DAYS: {
    VALUE: "90",
    TYPE: "day",
    LABEL: "Last 90 Days"
  },
  LAST6MONTHS: {
    VALUE: "6",
    TYPE: "month",
    LABEL: "Last 6 Months"
  },
  CUSTOMRANGE: {
    VALUE: "",
    TYPE: "",
    LABEL: "Custom Range"
  }
};
const RANGE_STATUS = Object.values(RANGE_ENUM);
const ACTIONS = ["View", "Edit", "Cancel"];
const ACCESS_DENIED_ERROR = [
  "Sorry, you do not have the permission to view departure request status."
];

const DepartureDashboard = () => {
  const [activeSort, setActiveSort] = useState(DEFAULT_ACTIVE_SORT);
  const [activePage, setActivePage] = useState(1);
  const [activeStatus, setActiveStatus] = useState("All Status");
  const [searchBarContent, setSearchBarContent] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showCancel, setShowCancel] = useState(false);
  const [formId, setFormId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [finishDate, setFinishDate] = useState(null);
  const [startDateSearchKey, setStartDateSearchKey] = useState(null);
  const [finishDateSearchKey, setFinishDateSearchKey] = useState(null);
  const [rangeValue, setRangeValue] = useState("All Dates");
  const columns = tableColumns;
  const history = useNavigate();
  const currentUser = useContext(UserContext);

  const onSort = column => {
    setActiveSort({ column, descending: !activeSort.descending });
    setActivePage(1);
    setFormData(applySort(formData, sort[column], !activeSort.descending));
  };

  const isTwoBusinessDaysBeforeToday = date => {
    return (
      compareDate(
        format(addBusinessDays(startOfToday(), 2), "dd/MM/yyyy"),
        date,
        "dd/MM/yyyy"
      ) >= 0
    );
  };

  // Tempted to use Reducer to avoid redundant code
  const subDaysForPicker = (count, type) => {
    switch (type) {
      case "day":
        return format(subDays(startOfToday(), count), "yyyy-MM-dd");
      case "week":
        return format(subWeeks(startOfToday(), count), "yyyy-MM-dd");
      case "month":
        return format(subMonths(startOfToday(), count), "yyyy-MM-dd");
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
      case RANGE_ENUM.LAST7DAYS.LABEL:
        setFinishDate(subDaysForPicker(0, RANGE_ENUM.LAST7DAYS.TYPE));
        setStartDate(
          subDaysForPicker(
            RANGE_ENUM.LAST7DAYS.VALUE,
            RANGE_ENUM.LAST7DAYS.TYPE
          )
        );
        break;
      case RANGE_ENUM.LAST30DAYS.LABEL:
        setFinishDate(subDaysForPicker(0, RANGE_ENUM.LAST30DAYS.TYPE));
        setStartDate(
          subDaysForPicker(
            RANGE_ENUM.LAST30DAYS.VALUE,
            RANGE_ENUM.LAST30DAYS.TYPE
          )
        );
        break;
      case RANGE_ENUM.LAST90DAYS.LABEL:
        setFinishDate(subDaysForPicker(0, RANGE_ENUM.LAST90DAYS.TYPE));
        setStartDate(
          subDaysForPicker(
            RANGE_ENUM.LAST90DAYS.VALUE,
            RANGE_ENUM.LAST90DAYS.TYPE
          )
        );
        break;
      case RANGE_ENUM.LAST6MONTHS.LABEL:
        setFinishDate(subDaysForPicker(0, RANGE_ENUM.LAST6MONTHS.TYPE));
        setStartDate(
          subDaysForPicker(
            RANGE_ENUM.LAST6MONTHS.VALUE,
            RANGE_ENUM.LAST6MONTHS.TYPE
          )
        );
        break;
      default:
        break;
    }
  };

  const compareMaxStartDateWithPickedFinishDate = pickedFinishDate => {
    if (isNil(pickedFinishDate)) {
      return subDaysForPicker(0, "day");
    } else {
      return pickedFinishDate;
    }
  };

  const isDisabledAction = (action, datum) => {
    switch (action) {
      case "View":
        return !UserFactory.create(currentUser).hasFullAccess();
      case "Cancel":
        // Only processing forms can be cancelled
        if (datum.status !== "Processing") {
          return true; // i.e. cancel button is disabled
        }
        // ES Team can always cancel a form
        if (UserFactory.create(currentUser).hasFullAccess()) {
          return false; // i.e. cancel button is enabled
        }
        // Any other case is judged on whether it's two business days before
        return isTwoBusinessDaysBeforeToday(datum.lastDayInTheOffice);
      case "Edit":
        return (
          datum.status !== "Processing" ||
          (isTwoBusinessDaysBeforeToday(datum.lastDayInTheOffice) &&
            !UserFactory.create(currentUser).hasFullAccess())
        );
      default:
        return false;
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
      history(`/form/departure/${selectedFormId}/preview`);
    } else if (event === "Cancel") {
      setShowCancel(true);
    } else if (event === "Edit") {
      history(`/form/departure/${selectedFormId}/edit`);
    }
    setFormId(selectedFormId);
  };

  const fetchForms = useCallback(async () => {
    setLoading(true);
    const resp = await getForms({
      page: activePage,
      size: PAGE_SIZE,
      sortBy: activeSort.column,
      desc: activeSort.descending,
      status: activeStatus === "All Status" ? "" : activeStatus,
      search: searchKey,
      startDate: startDateSearchKey,
      finishDate: finishDateSearchKey
    });
    if (resp.status === HttpStatus.FORBIDDEN) {
      history("/form/departure/access-denied", {
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
      {isNil(currentUser) && <CardWithLoadingStatus />}
      {!isNil(currentUser) && (
        <div>
          <PageHead title="Departure Form Dashboard">
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
                      <Select.Option
                        value={status}
                        label={status}
                        key={status}
                      />
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
                    max={subDaysForPicker(0, "day")}
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
                            disabled={isDisabledAction(action, datum)}
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
          {showCancel && (
            <CancelConfirmation
              formId={formId}
              onCancelDeparture={() => setShowCancel(false)}
            />
          )}
        </div>
      )}
    </>
  );
};

export default DepartureDashboard;
