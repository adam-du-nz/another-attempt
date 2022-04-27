import { Container } from "@myob/myob-widgets";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import React, { useEffect, useState } from "react";

import { getCurrentUser } from "../apis/kilnBackendApis";
import AccessDeny from "./common/AccessDeny";
import DepartureDashboard from "./departure-form/dashboard/DepartureDashboard";
import OnboardingDashboard from "./onboarding/dashboard/OnboardingDashboard";
import RoleUpdateDashboard from "./role-update/dashboard/RoleUpdateDashboard";
import DepartureForm from "./departure-form/DepartureForm";
import Error from "./common/Error";
import Header from "./common/Header";
import HomePage from "./home/HomePage";
import ParentalLeaveForm from "./parental-leave-form/creation/ParentalLeaveForm";
import OnboardingForm from "./onboarding/OnboardingForm";
import ThirdPartyContractorForm from "./third-party-contractor/ThirdPartyContractorForm";
import RoleUpdateForm from "./role-update/RoleUpdateForm";
import Success from "./common/Success";
import UserContext from "../auth/UserContext";

const App = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(null);

  useEffect(() => {
    const getAndSaveCurrentUser = async () => {
      setUserLoggedIn((await getCurrentUser()).data);
    };
    getAndSaveCurrentUser();
  }, []);

  return (
    <Router>
      <UserContext.Provider value={userLoggedIn}>
        <Header />
        <Container className="mainContainer">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/success" element={<Success />} />
            <Route path="/error" element={<Error />} />
            <Route path="/form/onboarding/*" element={<OnboardingForm />} />
            <Route
              path="/form/onboarding/list"
              element={<OnboardingDashboard />}
            />
            <Route
              path="/form/onboarding/access-denied"
              element={<AccessDeny />}
            />
            <Route
              path="/form/parental-leave"
              element={<ParentalLeaveForm />}
            />
            <Route path="/form/departure/*" element={<DepartureForm />} />
            <Route
              path="/form/departure/list"
              element={<DepartureDashboard />}
            />
            <Route
              path="/form/departure/access-denied"
              element={<AccessDeny />}
            />
            <Route
              path="/form/third-party-contractor/*"
              element={<ThirdPartyContractorForm />}
            />
            <Route path="/form/role-update/*" element={<RoleUpdateForm />} />
            <Route
              path="/form/role-update/list"
              element={<RoleUpdateDashboard />}
            />
            <Route
              path="/form/role-update/access-denied"
              element={<AccessDeny />}
            />
            <Route path="/*" element={<HomePage />} />
          </Routes>
        </Container>
      </UserContext.Provider>
    </Router>
  );
};

export default App;
