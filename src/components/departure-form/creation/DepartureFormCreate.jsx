import React, { useState, useContext } from "react";
import {
  FormHorizontal,
  PageHead,
  Tooltip,
  Button,
  ButtonRow
} from "@myob/myob-widgets";
import FormAlert from "../../common/FormAlert";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DepartureDetails from "../common/DepartureDetails";
import { schema } from "./validationSchema";
import { submitDepartureForm } from "../../../apis/kilnBackendApis";
import HttpStatus from "http-status-codes";
import { useNavigate } from "react-router-dom";
import EmployeeOrganisationDetails from "../../common/employee-organisation/EmployeeOrganisationDetails";
import Card from "../../common/Card";
import EmployeeOrganisationSelect from "../../common/employee-organisation/EmployeeOrganisationSelect";
import ImpactOfDepartureSelect from "../common/ImpactOfDepartureSelect";
import DepartureFormRequestDto from "../dto/DepartureFormRequestDto";
import { getOnsiteRepresentativesOptions } from "./utils/user";
import { checkLastDay } from "./utils/form";
import UserContext from "../../../auth/UserContext";
import UserFactory from "../../../factories/UserFactory";
import useFormPersist from "../../../utils/hooks/useFormPersist";

const hideImpactOfDeparture = new Set([
  "End of contract (fixed-term, casual or 3rd party)",
  "Did not start",
  "Deceased"
]);

const LAST_DAY_IN_OFFICE_NOTICE = {
  manager:
    "You are about to submit a departure form with an immediate departure date or departure date in the past. Once submitted, it cannot be cancelled or edited. Please check your date before submitting the departure form.",
  employeeServicesTeam:
    "You are about to submit a departure form with an immediate departure date or departure date in the past. Once submitted, it cannot be cancelled. Please check your date before submitting the departure form."
};

const DepartureFormCreate = ({ employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [manager, setManager] = useState({});
  const [onsiteRepresentativeCandidate, setOnsiteRepresentativeCandidate] =
    useState([]);
  const [newPossibleManagers, setNewPossibleManagers] = useState([]);
  const [lastDayInTheOfficeNoticeMessage, setLastDayInTheOfficeNoticeMessage] =
    useState("");
  const currentUser = useContext(UserContext);

  const history = useNavigate();

  const isDifferentLocationFromManagerAndNotDidNotStart = (
    departee,
    departeeManager,
    departureReason
  ) =>
    departeeManager &&
    departee.locationOffice !== departeeManager.locationOffice &&
    departureReason !== "Did not start";

  const shouldShowOnsiteRepresentativeSelection = () =>
    isDifferentLocationFromManagerAndNotDidNotStart(
      selectedEmployee,
      manager,
      form.getValues("departureReason")
    );

  const form = useForm({
    mode: "all",
    resolver: yupResolver(
      schema({
        hideImpactOfDeparture,
        shouldShowOnsiteRepresentativeSelection
      })
    ),
    shouldUnregister: true
  });

  form.watch(["departureReason"]);
  const formPersist = useFormPersist("departureForm", {
    watch: form.watch,
    setValue: form.setValue
  });

  const submit = async data => {
    try {
      const departureFormRequest = DepartureFormRequestDto.create(data);
      const res = await submitDepartureForm(departureFormRequest);
      if (res.status === HttpStatus.CREATED) {
        formPersist.clear();
        return history("/success", {
          messages: [
            "Departure form has been successfully submitted.",
            "To ensure smooth departure, please check your email and refer to the Employee Departure checklist link."
          ],
          button: {
            clickUrl: "/form/departure/list"
          }
        });
      }
      if (res.status === HttpStatus.CONFLICT) {
        return history("/error", {
          messages: [
            "The form could not be processed, looks like a duplicate. Please check the Departure Dashboard."
          ],
          button: {
            clickUrl: "/form/departure/list",
            text: "Go to Dashboard"
          },
          hideHelpMeTicketText: true
        });
      }
      if (res.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
        return history("/error");
      }
      history("/error", {
        messages: [res.data.message],
        hideHelpMeTicketText: true
      });
    } catch (e) {
      history("/error");
    }
  };

  const onSubmit = data => {
    submit(data);
  };

  const onEmployeeOrganisationChange = user => {
    const userManager = employees.find(
      employee =>
        employee.payglobalUsername === user.reportingManagerPayglobalUsername
    );
    setSelectedEmployee(user);
    setManager(userManager);

    const hasDirectReports =
      employees.filter(
        employee =>
          employee.reportingManagerPayglobalUsername === user.payglobalUsername
      ).length > 0;

    if (hasDirectReports) {
      setNewPossibleManagers(
        employees.filter(
          employee =>
            employee.userPrincipalName !== user.userPrincipalName &&
            employee.isADAccountEnabled
        )
      );
    }

    if (
      isDifferentLocationFromManagerAndNotDidNotStart(
        user,
        userManager,
        form.getValues("departureReason")
      )
    ) {
      setOnsiteRepresentativeCandidate(
        getOnsiteRepresentativesOptions(employees)
      );
    }

    form.setValue("employee", user);
    form.setValue("employeeId", user.id);
    form.setValue("payglobalUsername", user.payglobalUsername);
    form.setValue("hasDirectReports", hasDirectReports);

    form.setValue("positionTitle", user.positionTitle);
    form.setValue("function", user.function);
    form.setValue("group", user.group);
    form.setValue("department", user.department);
    form.setValue("team", user.team);
    form.setValue("vertical", user.vertical);
    form.setValue("location", user.locationOffice);
  };

  const onLastDayInTheOfficeChange = () => {
    if (!checkLastDay(form.getValues("lastDayInTheOffice"))) {
      setLastDayInTheOfficeNoticeMessage("");
      return;
    }
    if (UserFactory.create(currentUser).hasFullAccess()) {
      setLastDayInTheOfficeNoticeMessage(
        LAST_DAY_IN_OFFICE_NOTICE.employeeServicesTeam
      );
      return;
    }
    setLastDayInTheOfficeNoticeMessage(LAST_DAY_IN_OFFICE_NOTICE.manager);
  };

  return (
    <FormProvider {...form}>
      <FormHorizontal layout="primary">
        <PageHead title="Departure Form" />
        <form>
          <input
            name={"hasDirectReports"}
            hidden={true}
            {...form.register("hasDirectReports")}
          />
          <input
            name={"payglobalUsername"}
            hidden={true}
            {...form.register("payglobalUsername")}
          />
          <input
            name={"employeeId"}
            hidden={true}
            {...form.register("employeeId")}
          />
          <input
            name={"hasDirectReports"}
            hidden={true}
            {...form.register("hasDirectReports")}
          />

          <input
            name={"replacementManagerId"}
            hidden={true}
            {...form.register("replacementManagerId")}
          />
          <input
            name={"onsiteRepresentativeId"}
            hidden={true}
            {...form.register("replonsiteRepresentativeIdacementManagerId")}
          />

          <Card
            title={"Team Member Details"}
            body={
              <EmployeeOrganisationDetails>
                <EmployeeOrganisationSelect
                  name={"employee"}
                  label={`Select team member *`}
                  items={employees}
                  onChange={onEmployeeOrganisationChange}
                />
              </EmployeeOrganisationDetails>
            }
          />
          <Card
            title={"Departure Details"}
            body={
              <DepartureDetails
                onLastDayInTheOfficeChange={onLastDayInTheOfficeChange}
              >
                {!hideImpactOfDeparture.has(
                  form.getValues("departureReason")
                ) && (
                  <ImpactOfDepartureSelect
                    name={"departureImpact"}
                    label={"What is the impact of this departure *"}
                    labelAccessory={
                      <Tooltip>
                        Only select Not Regrettable if team member was involved
                        in formal performance, disciplinary or dismissal
                        processes
                      </Tooltip>
                    }
                    placeholder={"Select an option"}
                  />
                )}
                {shouldShowOnsiteRepresentativeSelection() && (
                  <EmployeeOrganisationSelect
                    name={"collectorName"}
                    label={`Nominate an onsite team member to collect MYOB equipment *`}
                    onChange={user => {
                      form.setValue("onsiteRepresentativeId", user.id);
                      form.setValue("collectorName", user);
                    }}
                    items={onsiteRepresentativeCandidate}
                  />
                )}
                {form.getValues("hasDirectReports") === "true" && (
                  <EmployeeOrganisationSelect
                    name={"newManager"}
                    label={`Who will the current direct reports now be reporting to? *`}
                    onChange={user => {
                      form.setValue("replacementManagerId", user.id);
                      form.setValue("newManager", user);
                    }}
                    items={newPossibleManagers}
                  />
                )}
                {lastDayInTheOfficeNoticeMessage && (
                  <FormAlert
                    alertType="info"
                    alertMessage={lastDayInTheOfficeNoticeMessage}
                  />
                )}
              </DepartureDetails>
            }
          />
          <ButtonRow>
            <Button
              tone="neutral"
              onClick={() => {
                formPersist.clear();
                history("/");
              }}
            >
              Cancel
            </Button>
            <Button tone="success" onClick={form.handleSubmit(onSubmit)}>
              Submit
            </Button>
          </ButtonRow>
        </form>
      </FormHorizontal>
    </FormProvider>
  );
};

export default DepartureFormCreate;
