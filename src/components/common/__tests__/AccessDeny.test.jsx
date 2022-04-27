import React from "react";
import { render } from "@testing-library/react";
import AccessDeny from "../AccessDeny";

describe("AccessDeny", () => {
  it("should render correctly", () => {
    const page = render(
      <AccessDeny
        location={{
          state: {
            errorMessages: [
              "Sorry, Employment Forms access is restricted to MYOB People Leaders.",
              "If you do believe you should have access, please contact your manager or People Consultants, or raise a HelpMe ticket."
            ]
          }
        }}
      />
    ).baseElement;
    expect(page).toMatchSnapshot();
  });
});
