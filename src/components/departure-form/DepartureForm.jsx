import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import DepartureFormCreate from "./creation/DepartureFormCreate";
import DepartureFormEdit from "./edit/DepartureFormEdit";
import { checkPermission, getUsersClass } from "../../apis/kilnBackendApis";
import HttpStatus from "http-status-codes";
import CardWithLoadingStatus from "../common/CardWithLoadingStatus";
import { StatusProvider } from "../../entities/StatusContext";

const ACCESS_DENIED_ERROR = [
  "Sorry, Employment Forms access is restricted to MYOB People Leaders.",
  "If you do believe you should have access, please contact your manager or People Consultants, or raise a HelpMe ticket."
];

const DepartureForm = () => {
  const [employees, setEmployees] = useState([]);
  const history = useNavigate();

  /**
   * Verifying role
   */
  useEffect(() => {
    const verifyRole = async () => {
      const permissionResp = await checkPermission("departure");
      if (permissionResp.status !== HttpStatus.OK) {
        history("/error", {
          state: {
            messages: ACCESS_DENIED_ERROR
          }
        });
      }
    };
    verifyRole();
  }, [history]);

  useEffect(() => {
    const fetchUsers = async () => {
      const employeesClass = await getUsersClass();
      setEmployees(employeesClass);
    };

    fetchUsers();
  }, []);

  return (
    <>
      {employees.length === 0 && <CardWithLoadingStatus />}
      {employees.length > 0 && (
        <Routes>
          <Route
            path={`/`}
            element={<DepartureFormCreate employees={employees} />}
          />
          <Route
            path={`/:id/edit`}
            element={
              <StatusProvider>
                <DepartureFormEdit employees={employees} />
              </StatusProvider>
            }
          />
          <Route
            path={`/:id/preview`}
            element={
              <StatusProvider>
                <DepartureFormEdit employees={employees} />
              </StatusProvider>
            }
          />
        </Routes>
      )}
    </>
  );
};

export default DepartureForm;
