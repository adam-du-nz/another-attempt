import React from "react";
import FormAlert from "../../common/FormAlert";

export default function NewPositionWarningMessage() {
  const text = `**Warning!** this position does not exist at MYOB. In order to introduce a new role to the business, you will need to raise a ticket
  with a People Consultant [here](https://securemyobhelpme.zendesk.com/hc/en-us/requests/new?ticket_form_id=360000018011). A change will not be processed until the role is graded.`;

  return <FormAlert alertMessage={text} alertType="warning"></FormAlert>;
}
