import { Alert, ButtonRow, Button } from "@myob/myob-widgets";

import React from "react";

import { path } from "ramda";
import { useNavigate } from "react-router-dom";

const Success = ({ location }) => {
  const history = useNavigate();
  const messages = path(["state", "messages"], location);
  const buttonConfig = path(["state", "button"], location);
  const { clickUrl, text } = buttonConfig || {};
  const onClickDashboard = () => history.replace(clickUrl);
  return (
    <>
      <Alert type="success">
        {messages.map(message => (
          <p key={message}>{message}</p>
        ))}
      </Alert>
      {buttonConfig && (
        <ButtonRow>
          <Button onClick={onClickDashboard}>
            {text || "Go to Dashboard"}
          </Button>
        </ButtonRow>
      )}
    </>
  );
};

export default Success;
