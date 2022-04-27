import React from "react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import mockAxios from "axios";
import {
  act,
  screen,
  render,
  fireEvent,
  waitFor
} from "@testing-library/react";
import { format } from "date-fns";

import OnboardingCreate from "../OnboardingCreate";
import UserContext from "../../../../auth/UserContext";

const mockSearchUsers = users => {
  mockAxios.post = jest.fn().mockResolvedValue({ data: users });
};

const mockGetUsers = users => {
  mockAxios.get = jest.fn().mockResolvedValue({ data: users });
};

describe("Onboarding Form", () => {
  beforeEach(() => {
    mockSearchUsers([{ id: 1 }]);
    mockGetUsers([{ id: 1 }]);
  });

  it("should call API six times when jobReqId is provided", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/form/onboarding"]}>
          <UserContext.Provider value={{ department: "default" }}>
            <OnboardingCreate jobReqId={"req420"} />
          </UserContext.Provider>
        </MemoryRouter>
      );
    });
    // six GET api calls
    // /api/users
    // /api/org/position-titles
    // /api/org/verticals
    // /api/org/functions
    // /api/org/cost-centres
    // /api/onboarding-forms/cs/${jobReqId}
    await waitFor(() => expect(mockAxios.get).toHaveBeenCalledTimes(6));
  });

  it("should call API five times when jobReqId is NOT provided", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/form/onboarding"]}>
          <UserContext.Provider value={{ department: "default" }}>
            <OnboardingCreate></OnboardingCreate>
          </UserContext.Provider>
        </MemoryRouter>
      );
    });
    // five GET api calls
    // /api/users
    // /api/org/position-titles
    // /api/org/verticals
    // /api/org/functions
    // /api/org/cost-centres
    await waitFor(() => expect(mockAxios.get).toHaveBeenCalledTimes(5));
  });

  it("should render card components", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/form/onboarding"]}>
          <UserContext.Provider value={{ department: "default" }}>
            <OnboardingCreate></OnboardingCreate>
          </UserContext.Provider>
        </MemoryRouter>
      );
    });

    expect(screen.queryByText("Employee Details")).toBeInTheDocument();
    expect(screen.queryByText("Agreement Details")).toBeInTheDocument();
    expect(screen.queryByText("Position Details")).toBeInTheDocument();
    expect(screen.queryByText("Finance Details")).toBeInTheDocument();
    expect(screen.queryByText("IT Details")).toBeInTheDocument();
  });

  it("should render Employee Details details", async () => {
    let rendered;
    await act(async () => {
      rendered = render(
        <MemoryRouter initialEntries={["/form/onboarding"]}>
          <UserContext.Provider value={{ department: "default" }}>
            <OnboardingCreate />
          </UserContext.Provider>
        </MemoryRouter>
      );
    });
    expect(rendered.getByLabelText("Legal First Name")).toBeInTheDocument();
    expect(rendered.getByLabelText("Preferred First Name")).toBeInTheDocument();
    expect(rendered.getByLabelText("Surname")).toBeInTheDocument();
    expect(rendered.getByLabelText("Email")).toBeInTheDocument();
    expect(
      rendered.getByText("This candidate isn't currently living in AU or NZ")
    ).toBeInTheDocument();
    expect(rendered.getByLabelText("Mobile Phone No.")).toBeInTheDocument();
    expect(rendered.getByLabelText("First Day Contact")).toBeInTheDocument();
    expect(rendered.getByLabelText("T-Shirt Size")).toBeInTheDocument();
    expect(
      rendered.getByLabelText("Working Rights Options")
    ).toBeInTheDocument();
    expect(
      rendered.getByLabelText("Employment Type Options")
    ).toBeInTheDocument();
    expect(rendered.getByLabelText("Start Date")).toBeInTheDocument();
    expect(rendered.getByLabelText("Start Time")).toBeInTheDocument();
    // "Reason for fixed-term" and "end date" should only show if "fixed-term"
    // is selected
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Employment Type Options"), {
        target: { value: "Permanent" }
      });
    });
    expect(
      rendered.queryByText("Reason for Fixed-Term")
    ).not.toBeInTheDocument();
    expect(rendered.queryByText("End Date")).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Employment Type Options"), {
        target: { value: "Fixed Term" }
      });
    });
    expect(rendered.queryByText("Reason for Fixed-Term")).toBeInTheDocument();
    expect(rendered.queryByText("End Date")).toBeInTheDocument();
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Start Date"), {
        target: { value: format(Date.now(), "dd/MM/yyyy") }
      });
    });
    expect(
      rendered.queryByText(
        "To ensure a great onboarding experience for your new starter",
        { exact: false }
      )
    ).toBeInTheDocument();
  });

  describe("should render agreement details section", () => {
    it('should render "Agreement Details" section', async () => {
      let rendered;
      await act(async () => {
        rendered = render(
          <MemoryRouter initialEntries={["/form/onboarding"]}>
            <UserContext.Provider value={{ department: "default" }}>
              <OnboardingCreate />
            </UserContext.Provider>
          </MemoryRouter>
        );
      });

      expect(rendered.getByLabelText("Primary Office")).toBeInTheDocument();
      expect(
        rendered.getByText("Relocation Expenses Included")
      ).toBeInTheDocument();
      expect(
        rendered.getByText(
          "This employee will be working remotely most of the time"
        )
      ).toBeInTheDocument();
      expect(rendered.getByText("Full Time Hours")).toBeInTheDocument();
      expect(rendered.getByText("Part Time Hours")).toBeInTheDocument();
      expect(rendered.getByLabelText("Base Salary")).toBeInTheDocument();
      expect(rendered.getByText("Commission required")).toBeInTheDocument();
      expect(
        rendered.getByLabelText("Comments on Agreement")
      ).toBeInTheDocument();
      expect(
        rendered.queryByLabelText("Number of Hours per Week")
      ).not.toBeInTheDocument();
      expect(
        rendered.queryByLabelText("Usual Days or pattern of week each week")
      ).not.toBeInTheDocument();
      await act(async () => {
        fireEvent.click(rendered.getByText("Full Time Hours"));
      });
      expect(
        rendered.queryByLabelText("Number of Hours per Week")
      ).not.toBeInTheDocument();
      expect(
        rendered.queryByLabelText("Usual Days or pattern of week each week")
      ).not.toBeInTheDocument();
      await act(async () => {
        fireEvent.click(rendered.getByText("Part Time Hours"));
      });
      expect(
        rendered.getByLabelText("Number of Hours per Week")
      ).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(rendered.getByLabelText("Number of Hours per Week"));
        fireEvent.blur(rendered.getByLabelText("Number of Hours per Week"));
      });
      expect(
        rendered.getByText("Please enter the correct number of hours")
      ).toBeInTheDocument();
      await act(async () => {
        fireEvent.change(rendered.getByLabelText("Number of Hours per Week"), {
          target: { value: 41 }
        });
        fireEvent.blur(rendered.getByLabelText("Number of Hours per Week"));
      });
      expect(
        rendered.getByText("Please enter the correct number of hours")
      ).toBeInTheDocument();
      expect(
        rendered.getByLabelText("Usual Days or pattern of week each week")
      ).toBeInTheDocument();
      expect(
        rendered.queryByLabelText("Annual on target earnings (OTE)")
      ).not.toBeInTheDocument();
      expect(
        rendered.queryByLabelText("Commission payment frequency")
      ).not.toBeInTheDocument();
      await act(async () => {
        fireEvent.click(rendered.getByText("Commission required"));
      });
      expect(
        rendered.getByLabelText("Annual on target earnings (OTE)")
      ).toBeInTheDocument();
      expect(
        rendered.getByLabelText("Commission payment frequency")
      ).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(rendered.getByLabelText("Base Salary"));
        fireEvent.blur(rendered.getByLabelText("Base Salary"));
      });
      expect(
        rendered.getByText("Please enter the correct base salary amount")
      ).toBeInTheDocument();
      expect(rendered.queryByText("Working Hours Options")).toBeInTheDocument();
      // "Hourly Rate" should only be shown if employment type is "Casual"
      expect(rendered.queryByLabelText("Hourly Rate")).not.toBeInTheDocument();
      await act(async () => {
        fireEvent.change(rendered.getByLabelText("Employment Type Options"), {
          target: { value: "Casual" }
        });
      });
      expect(rendered.getByLabelText("Hourly Rate")).toBeInTheDocument();
      // "Working Hours Options" and "Base Salary" should not show if employment type is "Casual"
      expect(
        rendered.queryByLabelText("Working Hours Options")
      ).not.toBeInTheDocument();
      expect(rendered.queryByLabelText("Base Salary")).not.toBeInTheDocument();
    });

    it('should render "Superannuation" and "Total Salary" values', async () => {
      const BASE_SALARY = 50000;
      const SUPERANNUATION = BASE_SALARY * 0.1;
      const TOTAL_SALARY = BASE_SALARY + SUPERANNUATION;
      let rendered;

      await act(async () => {
        rendered = render(
          <MemoryRouter initialEntries={["/form/onboarding"]}>
            <UserContext.Provider value={{ department: "default" }}>
              <OnboardingCreate />
            </UserContext.Provider>
          </MemoryRouter>
        );
      });

      // Select an office in Sidney to make visible the Superannuation attribute.
      expect(rendered.getByLabelText("Primary Office")).toBeInTheDocument();
      await act(async () => {
        await fireEvent.change(rendered.getByLabelText("Primary Office"), {
          target: { value: "AU - Sydney" }
        });
      });
      // Set the Base Salary to complete the superannuation calculation.
      const baseSalary = rendered.getByLabelText("Base Salary");
      await act(async () => {
        fireEvent.change(baseSalary, {
          target: { value: BASE_SALARY }
        });
        fireEvent.blur(baseSalary);
      });
      const superannuationTextInput = await rendered.queryByDisplayValue(
        `${SUPERANNUATION}`
      );
      // "Superannuation" value has to changed according the base salary value.
      expect(superannuationTextInput).toBeInTheDocument();
      expect(superannuationTextInput).toBeDisabled();
      let totalSalary = await rendered.queryByLabelText("Total Salary");
      expect(totalSalary).toBeInTheDocument();
      // "Total Salary" values has to changed according the base salary value.
      totalSalary = await rendered.queryByDisplayValue(`${TOTAL_SALARY}`);
      expect(totalSalary).toBeInTheDocument();
      expect(totalSalary).toBeDisabled();
    });
  });

  it("should render position details section", async () => {
    let rendered;
    await act(async () => {
      rendered = render(
        <MemoryRouter initialEntries={["/form/onboarding"]}>
          <UserContext.Provider value={{ department: "default" }}>
            <OnboardingCreate />
          </UserContext.Provider>
        </MemoryRouter>
      );
    });

    expect(rendered.getByLabelText("Team Member Level")).toBeInTheDocument();
    expect(rendered.getByLabelText("Position Title")).toBeInTheDocument();
    expect(rendered.getByText("Position Description")).toBeInTheDocument();
    expect(rendered.getByLabelText("Direct Manager")).toBeInTheDocument();
    expect(rendered.getByLabelText("Function")).toBeInTheDocument();
    expect(rendered.getByLabelText("Group")).toBeInTheDocument();
    expect(rendered.getByLabelText("Department")).toBeInTheDocument();
    expect(rendered.getByLabelText("Team")).toBeInTheDocument();
    expect(rendered.getByLabelText("Vertical")).toBeInTheDocument();
    expect(rendered.getByLabelText("Segment")).toBeInTheDocument();
    expect(rendered.getByLabelText("Cost Centre")).toBeInTheDocument();
    expect(
      rendered.queryByText("Project Cost Code required")
    ).toBeInTheDocument();
    expect(
      rendered.queryByText("A driver's licence is required for this role")
    ).toBeInTheDocument();
    expect(
      rendered.queryByText("On-call is a requirement for this role")
    ).toBeInTheDocument();
    expect(
      rendered.queryByText("Shift work is a requirement for this role")
    ).toBeInTheDocument();
    expect(rendered.queryByLabelText("Project Type")).not.toBeInTheDocument();
    expect(
      rendered.queryByLabelText("Project Cost Centre")
    ).not.toBeInTheDocument();
    expect(rendered.getByText("Project Cost Code")).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(rendered.getByText("Project Cost Code required"));
    });
    expect(rendered.getByLabelText("Project Type")).toBeInTheDocument();
    expect(rendered.getByLabelText("Project Cost Centre")).toBeInTheDocument();
    // "Casual Project Description" should only be shown if employment type is "Casual"
    expect(
      rendered.queryByLabelText("Casual Project Description")
    ).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Employment Type Options"), {
        target: { value: "Casual" }
      });
    });
    expect(
      rendered.getByLabelText("Casual Project Description")
    ).toBeInTheDocument();
    // "Position Description" should not show if if employment type is "Casual"
    expect(
      rendered.queryByText("Position Description")
    ).not.toBeInTheDocument();
  });

  it("should render financial details section for credit card", async () => {
    let rendered;
    await act(async () => {
      rendered = render(
        <MemoryRouter initialEntries={["/form/onboarding"]}>
          <UserContext.Provider value={{ department: "default" }}>
            <OnboardingCreate />
          </UserContext.Provider>
        </MemoryRouter>
      );
    });
    await act(async () => {
      await fireEvent.change(rendered.getByLabelText("Team Member Level"), {
        target: { value: "ELT" }
      });
    });

    expect(rendered.getByText("Credit card required")).toBeInTheDocument();
    expect(
      rendered.getByText("Does this role have delegated approval authority?")
    ).toBeInTheDocument();
    expect(rendered.queryByLabelText("Credit Limit")).not.toBeInTheDocument();
    expect(
      rendered.queryByText("Approval Documentation")
    ).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.click(rendered.getByText("Credit card required"));
    });
    expect(rendered.getByLabelText("Credit Limit")).toBeInTheDocument();
    expect(rendered.getByText("Approval Documentation")).toBeInTheDocument();
    expect(rendered.queryByLabelText("Approval Limit")).not.toBeInTheDocument();
  });

  it("should render financial details section for delegated approval if team member level is SLT/ELT", async () => {
    let rendered;
    await act(async () => {
      rendered = render(
        <MemoryRouter initialEntries={["/form/onboarding"]}>
          <UserContext.Provider value={{ department: "default" }}>
            <OnboardingCreate />
          </UserContext.Provider>
        </MemoryRouter>
      );
    });
    await act(async () => {
      await fireEvent.change(rendered.getByLabelText("Team Member Level"), {
        target: { value: "ELT" }
      });
    });

    expect(rendered.getByText("Credit card required")).toBeInTheDocument();
    expect(
      rendered.getByText("Does this role have delegated approval authority?")
    ).toBeInTheDocument();
    expect(rendered.queryByText("Approval Limit")).not.toBeInTheDocument();
    expect(
      rendered.queryByText("Approval Documentation")
    ).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.click(
        rendered.getByText("Does this role have delegated approval authority?")
      );
    });
    expect(rendered.getByLabelText("Approval Limit")).toBeInTheDocument();
    expect(rendered.getByText("Approval Documentation")).toBeInTheDocument();
    expect(rendered.queryByLabelText("Credit Limit")).not.toBeInTheDocument();
  });

  it("should not render the delegated approval section for Team Members/People Leaders", async () => {
    let rendered;
    await act(async () => {
      rendered = render(
        <MemoryRouter initialEntries={["/form/onboarding"]}>
          <UserContext.Provider value={{ department: "default" }}>
            <OnboardingCreate />
          </UserContext.Provider>
        </MemoryRouter>
      );
    });
    await act(async () => {
      await fireEvent.change(rendered.getByLabelText("Team Member Level"), {
        target: { value: "Team Member" }
      });
    });

    expect(rendered.getByText("Credit card required")).toBeInTheDocument();
    expect(
      rendered.queryByText("Does this role have delegated approval authority?")
    ).not.toBeInTheDocument();
    expect(rendered.queryByText("Approval Limit")).not.toBeInTheDocument();
    expect(
      rendered.queryByText("Approval Documentation")
    ).not.toBeInTheDocument();
  });

  it("should render IT Details section", async () => {
    let rendered;
    await act(async () => {
      rendered = render(
        <MemoryRouter initialEntries={["/form/onboarding"]}>
          <UserContext.Provider value={{ department: "default" }}>
            <OnboardingCreate />
          </UserContext.Provider>
        </MemoryRouter>
      );
    });
    expect(
      rendered.getByText("Local Admin Access required")
    ).toBeInTheDocument();
    expect(rendered.getByLabelText("Computer Hardware")).toBeInTheDocument();
    expect(rendered.getByText("Genesys required")).toBeInTheDocument();
    expect(rendered.getByText("Mobile phone required")).toBeInTheDocument();
    expect(
      rendered.queryByText("Port a current number required")
    ).not.toBeInTheDocument();
    expect(rendered.getByLabelText("Network Drives")).toBeInTheDocument();
    expect(
      rendered.getByText("PBCS/Hyperion (SLT, CA’s and Finance only)")
    ).toBeInTheDocument();
    expect(
      rendered.getByText(
        "Please provide a shared mailbox name or distribution list group name to be added for the new user"
      )
    ).toBeInTheDocument();
    expect(
      rendered.getByText("Additional IT access required")
    ).toBeInTheDocument();
    expect(rendered.queryByText("Cancel Reason")).not.toBeInTheDocument();
  });

  it("should render IT Details for genesys options if required", async () => {
    let rendered;
    await act(async () => {
      rendered = render(
        <MemoryRouter initialEntries={["/form/onboarding"]}>
          <UserContext.Provider value={{ department: "default" }}>
            <OnboardingCreate />
          </UserContext.Provider>
        </MemoryRouter>
      );
    });
    await act(async () => {
      fireEvent.click(rendered.getByText("Genesys required"));
    });
    expect(
      rendered.getByLabelText("Which Group will the new agent be part of?")
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(rendered.getByText("Mobile phone required"));
    });
    expect(
      rendered.getByText("Port a current number required")
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(rendered.getByText("Port a current number required"));
    });
    expect(rendered.getByLabelText("Current Phone Number")).toBeInTheDocument();
    expect(
      rendered.getByLabelText("Current Service Provider")
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Current Phone Number"), {
        target: { value: -1 }
      });
      fireEvent.blur(rendered.getByLabelText("Current Phone Number"));
    });
    expect(
      rendered.getByText("Please provide a valid phone number")
    ).toBeInTheDocument();
  });

  it("should render IT Details for software details if required", async () => {
    let rendered;
    await act(async () => {
      rendered = render(
        <MemoryRouter initialEntries={["/form/onboarding"]}>
          <UserContext.Provider value={{ department: "default" }}>
            <OnboardingCreate />
          </UserContext.Provider>
        </MemoryRouter>
      );
    });
    await act(async () => {
      fireEvent.click(rendered.getByText("Archie"));
    });
    expect(
      rendered.getByLabelText("Archie Access Based on")
    ).toBeInTheDocument();
    expect(
      rendered.getByLabelText("Reporting Line Manager")
    ).toBeInTheDocument();
    // "Archie Analytics access" is separate from "Archie access"
    expect(
      rendered.queryByText("Archie Analytics access based on")
    ).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.click(rendered.getByText("Archie Analytics"));
    });
    expect(
      rendered.getByLabelText("Archie Analytics access based on")
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(rendered.getByText("Archie"));
    });
    expect(
      rendered.queryByText("Archie Access Based on")
    ).not.toBeInTheDocument();
    expect(
      rendered.queryByText("Reporting Line Manager")
    ).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(rendered.getByText("Other"));
    });

    expect(
      rendered.getByLabelText("Other software required")
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Other software required"), {
        target: { value: "other software" }
      });
      fireEvent.blur(rendered.getByLabelText("Other software required"));
    });
    expect(
      rendered.queryByText(/Please specify the software/i)
    ).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.change(rendered.getByLabelText("Other software required"), {
        target: { value: "" }
      });
      fireEvent.blur(rendered.getByLabelText("Other software required"));
    });
    expect(
      rendered.getByText("Please specify the software")
    ).toBeInTheDocument();
  });

  it("should render Zendesk instance/queue input-box when zendesk agent licence is chosen", async () => {
    let rendered;
    await act(async () => {
      rendered = render(
        <MemoryRouter initialEntries={["/form/onboarding"]}>
          <UserContext.Provider value={{ department: "default" }}>
            <OnboardingCreate />
          </UserContext.Provider>
        </MemoryRouter>
      );
    });
    await act(async () => {
      fireEvent.click(rendered.getByText("Zendesk (Agent Licence)"));
    });
    expect(rendered.getByText("Select Zendesk Instance")).toBeInTheDocument();
    expect(
      rendered.getByLabelText("Provide Zendesk Queue Name")
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(rendered.getByText("Zendesk - Account Receivable"));
    });
    await act(async () => {
      fireEvent.click(rendered.getByText("Zendesk - Account Receivable"));
    });
    await act(async () => {
      fireEvent.blur(rendered.getByLabelText("Provide Zendesk Queue Name"));
    });
    expect(
      rendered.getByText("Please select a Zendesk instance")
    ).toBeInTheDocument();
    expect(
      rendered.getByText(
        "Please provide a valid zendesk queue name otherwise type in N/A"
      )
    ).toBeInTheDocument();
  });

  it("should render Tableau access type when clicked", async () => {
    let rendered;
    await act(async () => {
      rendered = render(
        <MemoryRouter initialEntries={["/form/onboarding"]}>
          <UserContext.Provider value={{ department: "default" }}>
            <OnboardingCreate />
          </UserContext.Provider>
        </MemoryRouter>
      );
    });
    await act(async () => {
      fireEvent.click(rendered.getByText("Tableau"));
    });
    expect(rendered.getByText("Tableau Access Type")).toBeInTheDocument();
    expect(rendered.getByText("Viewer")).toBeInTheDocument();
    expect(rendered.getByText("Explorer")).toBeInTheDocument();
    expect(rendered.getByText("Creator")).toBeInTheDocument();
  });
});
