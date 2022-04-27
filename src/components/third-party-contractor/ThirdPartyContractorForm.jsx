import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { getUsersClass } from "../../apis/kilnBackendApis";
import CardWithLoadingStatus from "../common/CardWithLoadingStatus";
import ThirdPartyContractorFormCreate from "./creation/ThirdPartyContractorFormCreate";

export default function ThirdPartyContractorForm() {
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
      <>
        {employees?.length === 0 && <CardWithLoadingStatus />}
        {employees?.length > 0 && (
          <Routes>
            <Route
              path={`/`}
              element={<ThirdPartyContractorFormCreate employees={employees} />}
            />
          </Routes>
        )}
      </>
    </>
  );
}
