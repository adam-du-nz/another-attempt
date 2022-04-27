import { Card, Columns, Label, PageHead } from "@myob/myob-widgets";
import { Link } from "react-router-dom";
import React from "react";

const FormCard = ({ href, label, content }) => (
  <Card>
    <Link to={href} style={{ textDecoration: "none" }}>
      <Label color="blue" size="large">
        {label}
      </Label>
      <p />
      <p>{content}</p>
    </Link>
  </Card>
);

const HomePage = () => {
  return (
    <>
      <PageHead title="Employee Forms" />
      <Columns type="three">
        <FormCard
          href="/form/departure"
          label="Departure Request"
          content="This form should be used to advise relevant teams that an employee is departing at a future date, or has already left."
        />
        <Card>
          <a
            rel="noopener noreferrer"
            href={
              "https://securemyobhelpme.zendesk.com/hc/en-us/requests/new?ticket_form_id=1900000083287"
            }
            style={{ textDecoration: "none" }}
          >
            <Label color="blue" size="large">
              Name Change Request
            </Label>
            <p />
            <p>
              This form should be used to automatically update team member's
              name on their MYOB user account.
            </p>
          </a>
        </Card>
        <FormCard
          href="/form/role-update"
          label="Role Update/Transfer Request"
          content="This form should be used to process the new details for a team member who is transferring roles or has an update to their current role. Also used to advise relevant teams that reporting line has changed, and to extend contractor end dates."
        />
        <FormCard
          href="/form/third-party-contractor"
          label="3rd Party Contractor Form"
          content="This form should be used to advise relevant teams that a new team member is joining MYOB as a contractor. Please note, you must have a current Consultancy or Enterprise Level Agreement in place before you submit this form."
        />
        <FormCard
          href="/form/parental-leave"
          label="Parental Leave Form"
          content="This form should be used to apply for Parental Leave. You will need to attach relevant copies of medical certificate or adoption paperwork."
        />
      </Columns>
      <Label>
        If you've got any questions or need help figuring out which is the
        correct form to use, please contact{" "}
        <a rel="noopener noreferrer" href="https://helpme.myob.com">
          HelpMe
        </a>
        .
      </Label>
    </>
  );
};

export default HomePage;
