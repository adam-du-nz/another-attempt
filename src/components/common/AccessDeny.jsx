import { Label, MYOBLogo } from "@myob/myob-widgets";
import React from "react";

const AccessDeny = props => {
  return (
    <>
      <Label color="blue" size="large">
        Access Denied
      </Label>
      {props.location.state.errorMessages.map(errorMessage => (
        <p key={errorMessage} style={{ margin: 0, marginTop: "1rem" }}>
          {errorMessage}
        </p>
      ))}
      <div style={{ width: "80px", padding: "1rem", float: "right" }}>
        <MYOBLogo />
      </div>
    </>
  );
};

export default AccessDeny;
