import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  ButtonRow,
  FormHorizontal,
  PageHead,
  Tooltip
} from "@myob/myob-widgets";
import FormAlert from "../../common/FormAlert";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DepartureDetails from "../common/DepartureDetails";
import { schema } from "../creation/validationSchema";
import {
  submitEditDepartureForm,
  getDepartureFormByIdResponse
} from "../../../apis/kilnBackendApis";
import HttpStatus from "http-status-codes";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import EmployeeOrganisationDetails from "../../common/employee-organisation/EmployeeOrganisationDetails";
import Card from "../../common/Card";
import EmployeeOrganisationSelect from "../../common/employee-organisation/EmployeeOrganisationSelect";
import ImpactOfDepartureSelect from "../common/ImpactOfDepartureSelect";
import DepartureFormRequestDto from "../dto/DepartureFormRequestDto";
import CardWithLoadingStatus from "../../common/CardWithLoadingStatus";
import DepartureFormFrontendDto from "../dto/DepartureFormFrontendDto";
import UserContext from "../../../auth/UserContext";
import { getOnsiteRepresentativesOptions } from "../creation/utils/user";
import { checkLastDay } from "../creation/utils/form";
import UserFactory from "../../../factories/UserFactory";
import useFormStatus from "../../../entities/useFormStatus";
import { StatusContext } from "../../../entities/StatusContext";
import { isLocationInPreviewMode } from "../../../utils";

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

const DepartureFormEdit = ({ employees }) => {
  const history = useNavigate();
  const location = useLocation();
  const isPreviewMode = isLocationInPreviewMode(location);
  const { id: formId } = useParams();
  const { toggleStatus } = useFormStatus();
  const [status] = useContext(StatusContext);

  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [resignationLetter, setResignationLetter] = useState([]);
  const [manager, setManager] = useState({});
  const [newPossibleManagers, setNewPossibleManagers] = useState([]);
  const [onsiteRepresentativeCandidate, setOnsiteRepresentativeCandidate] =
    useState([]);
  const [lastDayInTheOfficeNoticeMessage, setLastDayInTheOfficeNoticeMessage] =
    useState("");
  const currentUser = useContext(UserContext);

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

  const shouldDisableFormOnPreview = () => {
    if (isPreviewMode) {
      toggleStatus();
    }
  };

  form.watch(["departureReason", "hasDirectReports"]);

  useEffect(() => {
    const fetchUser = async () => {
      /** Get Form value **/
      const response = await getDepartureFormByIdResponse(formId);

      if (response.status !== HttpStatus.OK) {
        return history("/error", {
          messages: [response.data.message]
        });
      }
      const departureFormDto = DepartureFormFrontendDto.create(response.data);
      form.reset(departureFormDto); // asynchronously reset your form values
      const userManager = employees.find(
        employee =>
          employee.payglobalUsername ===
          selectedEmployee.reportingManagerPayglobalUsername
      );

      const hasDirectReports =
        employees.filter(
          employee =>
            employee.reportingManagerPayglobalUsername ===
            selectedEmployee.payglobalUsername
        ).length > 0;

      const settingValueInForm = () => {
        if (departureFormDto.resignationLetter) {
          setResignationLetter(departureFormDto.resignationLetter[0]);
        }
        setSelectedEmployee(departureFormDto.employee);
        setManager(userManager);
        if (hasDirectReports) {
          setNewPossibleManagers(
            employees.filter(
              employee =>
                employee.userPrincipalName !==
                  selectedEmployee.userPrincipalName &&
                employee.isADAccountEnabled
            )
          );
        }
        setOnsiteRepresentativeCandidate(
          getOnsiteRepresentativesOptions(employees)
        );
      };
      settingValueInForm();

      form.setValue("hasDirectReports", hasDirectReports, {
        shouldValidate: true
      });
    };

    fetchUser();
    shouldDisableFormOnPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.reset, location.pathname]);

  const submit = async data => {
    try {
      const departureFormRequest = DepartureFormRequestDto.createEdit(data);
      const res = await submitEditDepartureForm(formId, departureFormRequest);

      if (
        res.status === HttpStatus.NO_CONTENT ||
        res.status === HttpStatus.OK
      ) {
        return history("/success", {
          messages: [
            "Departure form has been successfully edited.",
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
      history("/error", { errorMessage: e });
    }
  };

  const onSubmit = data => {
    submit(data);
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

  const shouldDisplayCancelOrBackButton = () => {
    const cancelButton = (
      <Button tone="neutral" onClick={() => history(-1)}>
        Cancel
      </Button>
    );
    const backButton = (
      <Button tone="neutral" onClick={() => history("/form/departure/list")}>
        Back to Dashboard
      </Button>
    );
    if (status.disabled) {
      return backButton;
    }
    return cancelButton;
  };

  return (
    <>
      {Object.keys(selectedEmployee).length === 0 && <CardWithLoadingStatus />}
      {Object.keys(selectedEmployee).length !== 0 && (
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
                {...form.register("onsiteRepresentativeId")}
              />

              <Card
                title={"Team Member Details"}
                body={
                  <EmployeeOrganisationDetails>
                    <EmployeeOrganisationSelect
                      name={"employee"}
                      label={`Select team member *`}
                      items={employees}
                      disabled={true}
                    />
                  </EmployeeOrganisationDetails>
                }
              />
              <Card
                title={"Departure Details"}
                body={
                  <DepartureDetails
                    onLastDayInTheOfficeChange={onLastDayInTheOfficeChange}
                    resignationLetter={resignationLetter}
                  >
                    {!hideImpactOfDeparture.has(
                      form.getValues("departureReason")
                    ) && (
                      <ImpactOfDepartureSelect
                        name={"departureImpact"}
                        label={"What is the impact of this departure *"}
                        labelAccessory={
                          <Tooltip>
                            Only select Not Regrettable if team member was
                            involved in formal performance, disciplinary or
                            dismissal processes
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
                          form.setValue("onsiteRepresentativeId", user.id, {
                            shouldValidate: true
                          });
                          form.setValue("collectorName", user, {
                            shouldValidate: true
                          });
                        }}
                        items={onsiteRepresentativeCandidate}
                      />
                    )}
                    {form.getValues("hasDirectReports") === "true" && (
                      <EmployeeOrganisationSelect
                        name={"newManager"}
                        label={`Who will the current direct reports now be reporting to? *`}
                        onChange={user => {
                          form.setValue("replacementManagerId", user.id, {
                            shouldValidate: true
                          });
                          form.setValue("newManager", user, {
                            shouldValidate: true
                          });
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
                {shouldDisplayCancelOrBackButton()}
                <Button
                  tone="success"
                  disabled={status.disabled}
                  onClick={form.handleSubmit(onSubmit)}
                >
                  Submit
                </Button>
              </ButtonRow>
            </form>
          </FormHorizontal>
        </FormProvider>
      )}
    </>
  );
};

export default DepartureFormEdit;
