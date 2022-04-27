import React from "react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import mockAxios from "axios";
import { act, screen, render } from "@testing-library/react";
import UserContext from "../../../../auth/UserContext";
import RoleUpdateCreate from "../RoleUpdateCreate";

const mockSearchUsers = users => {
  mockAxios.post = jest.fn().mockResolvedValue({ data: users });
};

const mockGetUsers = users => {
  mockAxios.get = jest.fn().mockResolvedValue({ data: users });
};

describe("Role Update / Transfer Form", () => {
  beforeEach(() => {
    mockSearchUsers([{ id: 1 }]);
    mockGetUsers([{ id: 1 }]);
  });

  it("should render card components", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/form/role-update"]}>
          <UserContext.Provider value={{ department: "default" }}>
            <RoleUpdateCreate></RoleUpdateCreate>
          </UserContext.Provider>
        </MemoryRouter>
      );
    });

    expect(
      screen.queryByText("Role Update / Transfer Form")
    ).toBeInTheDocument();
    expect(screen.queryByText("Current Employee Details")).toBeInTheDocument();
  });
});
