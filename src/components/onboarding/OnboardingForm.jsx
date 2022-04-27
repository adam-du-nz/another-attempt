import React, { useState, useEffect } from "react";
import {
  Route,
  Routes,
  useNavigate,
  useMatch,
  useLocation
} from "react-router-dom";
import HttpStatus from "http-status-codes";
import { checkPermission, getUsersClass } from "../../apis/kilnBackendApis";
import OnboardingCreate from "./create/OnboardingCreate";
import OnboardingFormEdit from "./edit/OnboardingFormEdit";
import { StatusProvider } from "../../entities/StatusContext";
import CardWithLoadingStatus from "../common/CardWithLoadingStatus";

const ACCESS_DENIED_ERROR = [
  "Sorry, Employment Forms access is restricted to MYOB People Leaders.",
  "If you do believe you should have access, please contact your manager or People Consultants, or raise a HelpMe ticket."
];

const OnboardingForm = () => {
  const { path } = useMatch();

  const [employees, setEmployees] = useState([]);

  const history = useNavigate();

  // Verify they have the correct role to be able to access the page
  useEffect(() => {
    const verifyRole = async () => {
      const permissionResp = await checkPermission("onboarding");
      if (permissionResp.status !== HttpStatus.OK) {
        history("/error", {
          messages: ACCESS_DENIED_ERROR
        });
      }
    };
    verifyRole();
  }, [history]);

  // A custom hook that builds on useLocation to parse
  // the query string for you.
  const useQuery = () => new URLSearchParams(useLocation().search);
  let query = useQuery();
  const jobReqId = query.get("req");
  const applicantId = query.get("applicant");

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
    <Routes>
      {employees.length <= 0 && <CardWithLoadingStatus />}
      {employees.length > 0 && (
        <>
          <Route
            exact
            path={path}
            render={() => (
              <OnboardingCreate
                employees={employees}
                jobReqId={jobReqId}
                applicantId={applicantId}
              />
            )}
          />
          <Route
            exact
            path={`${path}/:id/edit`}
            render={props => (
              <StatusProvider>
                <OnboardingFormEdit {...props} employees={employees} />
              </StatusProvider>
            )}
          />
          <Route
            exact
            path={`${path}/:id/preview`}
            render={props => (
              <StatusProvider>
                <OnboardingFormEdit {...props} employees={employees} />
              </StatusProvider>
            )}
          />
        </>
      )}
    </Routes>
  );
};

export default OnboardingForm;
