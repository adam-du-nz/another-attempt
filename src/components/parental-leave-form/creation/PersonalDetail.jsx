import { Input } from "@myob/myob-widgets";
import { useFormContext } from "react-hook-form";
import React, { useContext, useEffect, useState } from "react";
import Card from "../../common/Card";
import { EEFormSearch } from "../../common/form-fields";
import { getUsers } from "../../../apis/kilnBackendApis";
import UserContext from "../../../auth/UserContext";
import { isNil } from "ramda";
import { isNotNilEmpty } from "../../../utils";

const PersonalDetail = () => {
  const { getValues, setValue } = useFormContext();
  const userLoggedIn = useContext(UserContext);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const users = (await getUsers()).data;
      const activeUsers = users
        .filter(
          (user) =>
            user.isADAccountEnabled && isNotNilEmpty(user.payglobalUsername)
        )
        .map((user) => ({
          ...user,
          userFullName: `${user.firstName} ${user.surname}`,
          managerFullName: user.manager
            ? `${user.manager?.firstName} ${user.manager?.surname}`
            : "",
        }));
      setAllUsers(activeUsers);
    };
    fetchUser().catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log("allUsers", allUsers);

  useEffect(() => {
    if (isNil(userLoggedIn)) {
      return;
    }
    const currentUser = allUsers.find((user) => user.id === userLoggedIn.id);
    setValue("employee", currentUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUsers, userLoggedIn]);

  const metaData = [
    { columnName: "userFullName", columnWidth: "150px", showData: true },
    { columnName: "userPrincipalName", columnWidth: "243px", align: "right" },
  ];

  const fields = [
    { name: "firstName", label: "First Name" },
    { name: "surname", label: "Last Name" },
    { name: "email", label: "MYOB Email" },
    { name: "managerFullName", label: "Manager's Name" },
    { name: "locationCountry", label: "Country" },
    { name: "locationOffice", label: "Office Location" },
  ];
  return (
    <>
      <Card
        title={"Personal Details"}
        body={
          <>
            <EEFormSearch
              name="employee"
              label="Employee"
              items={allUsers}
              metaData={metaData}
            />
            {fields.map((field) => (
              <Input
                key={field.name}
                name={field.name}
                label={field.label}
                value={getValues().employee?.[field.name]}
                disabled
              />
            ))}
          </>
        }
      />
    </>
  );
};

export default PersonalDetail;
