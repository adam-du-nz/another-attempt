import {
  Navigation,
  MYOBLogo,
  UserProfileIcon,
  CaretIcon,
  SignOutIcon
} from "@myob/myob-widgets";
import { useNavigate } from "react-router-dom";
import React, { useContext } from "react";

import { authContext } from "../../auth/adalConfig";
import UserContext from "../../auth/UserContext";

let formTypes = [
  {
    id: "HelpMeFormsDeparture",
    name: "departure",
    enabled: {
      create: true,
      list: true
    },
    directLink: true,
    title: "Departure Form"
  },
  {
    id: "HelpMeFormsNameChange",
    name: "nameChange",
    enabled: {
      create: true,
      list: false
    },
    directLink: true,
    url:
      "https://securemyobhelpme.zendesk.com/hc/en-us/requests/new?ticket_form_id=1900000083287",
    title: "Name Change Form"
  },
  {
    id: "HelpMeFormsTransfer",
    name: "role-update",
    enabled: {
      create: true,
      list: true
    },
    directLink: true,
    title: "Role Update/Transfer Form"
  },
  {
    id: "3rdPartyContractor",
    name: "third-party-contractor",
    enabled: {
      create: true,
      list: false
    },
    directLink: true,
    title: "3rd Party Contractor Form"
  },
  {
    id: "HelpMeFormsNewStarter",
    name: "newStarter",
    enabled: {
      create: false,
      list: false
    },
    directLink: true,
    title: "New Starter Form"
  },
  {
    id: "EmploymentFormsOnboarding",
    name: "onboarding",
    enabled: {
      create: false,
      list: true
    },
    directLink: true,
    title: "Onboarding Form"
  },
  {
    id: "EmployeeFormsParentalLeave",
    name: "parental-leave",
    enabled: {
      create: true,
      list: false
    },
    directLink: true,
    title: "Parental Leave Form"
  }
];

export default function Header() {
  const navigate = useNavigate();
  const navigateToUrl = e => {
    e.preventDefault();
    navigate(e.target.pathname);
  };

  const noop = () => {};

  const user = useContext(UserContext);

  const brand = (
    <Navigation.Brand url="/" width="73px" onClick={navigateToUrl}>
      <MYOBLogo />
    </Navigation.Brand>
  );

  const primary = [
    <Navigation.Menu
      key="menu-new-form"
      label="New Form"
      icon={<CaretIcon />}
      onSelect={noop}
      items={formTypes
        .filter(formType => formType.name && formType.enabled.create)
        .map(formType => (
          <Navigation.MenuLink
            key={`menu-new-${formType.id}`}
            url={formType.url || `/form/${formType.name}`}
            onClick={formType.directLink ? noop : navigateToUrl}
            label={formType.title}
          />
        ))}
    />,
    <Navigation.Menu
      key="menu-manage"
      label="Employee Form Dashboard"
      icon={<CaretIcon />}
      onSelect={noop}
      items={formTypes
        .filter(formType => formType.name && formType.enabled.list)
        .map(formType => (
          <Navigation.MenuLink
            key={`menu-list-${formType.id}`}
            url={`/form/${formType.name}/list`}
            onClick={formType.directLink ? noop : navigateToUrl}
            label={formType.title}
          />
        ))}
    />
  ];

  const secondary = [
    <Navigation.Menu
      key="user-menu"
      label={`Hello ${user ? `${user.firstName} ${user.surname}` : ""}`}
      icon={<UserProfileIcon />}
      onSelect={noop}
      items={[
        <Navigation.MenuLink
          key="Logout"
          label="Logout"
          url="#logout"
          onClick={() => authContext.logOut()}
          icon={<SignOutIcon />}
          iconRight
        />
      ]}
    />
  ];

  return <Navigation brand={brand} primary={primary} secondary={secondary} />;
};
