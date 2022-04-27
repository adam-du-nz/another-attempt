import { Alert, ButtonRow, Button } from "@myob/myob-widgets";
import { path, isEmpty } from "ramda";
import React from "react";
import { useNavigate } from "react-router-dom";

const HELP_ME_TICKET_URL =
  "https://helpme.myob.com/hc/en-us/requests/new?ticket_form_id=617268";
const DEFAULT_ERROR =
  "We've encountered an error. Please check back again later. If the issue persists, please submit a Help Me ticket ";

const Error = ({ location }) => {
  const history = useNavigate();
  const buttonConfig = path(["state", "button"], location) || { text: "Back" };
  const { clickUrl, text } = buttonConfig;
  const onClickButton = clickUrl
    ? () => history.replace(clickUrl)
    : history.goBack;
  const hideHelpMeTicketText = path(
    ["state", "hideHelpMeTicketText"],
    location
  );
  const messages = path(["state", "messages"], location) || [];
  console.error("Errors happen", messages);

  const helpMeTicketLink = (
    <a href={HELP_ME_TICKET_URL} target="_blank" rel="noopener noreferrer">
      here
    </a>
  );
  const messagesDisplay = messages.map(message => (
    <p key={message}>{message}</p>
  ));
  if (isEmpty(messages)) {
    messagesDisplay.push(
      <p key="defaultmessage">
        {DEFAULT_ERROR} {helpMeTicketLink}.
      </p>
    );
  } else if (!hideHelpMeTicketText) {
    messagesDisplay.push(
      <p key="helpmetickettext">
        Please submit a Help Me Ticket {helpMeTicketLink}.
      </p>
    );
  }

  return (
    <>
      <Alert type="danger">{messagesDisplay}</Alert>
      <ButtonRow>
        <Button onClick={onClickButton}>{text}</Button>
      </ButtonRow>
    </>
  );
};

export default Error;
