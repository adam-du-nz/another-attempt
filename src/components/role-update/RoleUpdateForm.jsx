import HttpStatus from "http-status-codes";
import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import RoleUpdateCreate from "./create/RoleUpdateCreate";
import RoleUpdateEdit from "./edit/RoleUpdateEdit";
import RoleUpdatePreview from "./edit/RoleUpdatePreview";
import { checkPermission, getUsersClass } from "../../apis/kilnBackendApis";
import { StatusProvider } from "../../entities/StatusContext";
import CardWithLoadingStatus from "../common/CardWithLoadingStatus";

const ACCESS_DENIED_ERROR = [
  "Sorry, Employment Forms access is restricted to MYOB People Leaders.",
  "If you do believe you should have access, please contact your manager or People Consultants, or raise a HelpMe ticket."
];

const RoleUpdateForm = () => {
  const history = useNavigate();

  // Verify they have the correct role to be able to access the page
  useEffect(() => {
    const verifyRole = async () => {
      const permissionResp = await checkPermission("role-update");
      if (permissionResp.status !== HttpStatus.OK) {
        history("/error", {
          messages: ACCESS_DENIED_ERROR
        });
      }
    };
    verifyRole();
  }, [history]);

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const employeesClass = await getUsersClass();
      const activeUsers = employeesClass.filter(
        user => user.isADAccountEnabled
      );
      setEmployees(activeUsers);
    };
    fetchUsers();
  }, []);

  return (
    <>
      {employees.length <= 0 && <CardWithLoadingStatus />}
      {employees.length > 0 && (
        <Routes>
          <Route
            path={`/`}
            element={<RoleUpdateCreate employees={employees} />}
          />
          <Route
            path={`/:id/edit`}
            element={
              <StatusProvider>
                <RoleUpdateEdit employees={employees} />
              </StatusProvider>
            }
          />
          <Route
            path={`/:id/preview`}
            element={
              <StatusProvider>
                <RoleUpdatePreview employees={employees} />
              </StatusProvider>
            }
          />
        </Routes>
      )}
    </>
  );
};

export default RoleUpdateForm;
