import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  ButtonRow,
  FormHorizontal,
  PageHead,
  PageState,
  Spinner
} from "@myob/myob-widgets";
import HttpStatus from "http-status-codes";
import { isNil } from "ramda";
import React, { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import WarningMessage from "./WarningMessage";
import EmployeeName from "../common/EmployeeName";
import UserContext from "../../../auth/UserContext";
import CardWithLoadingStatus from "../../common/CardWithLoadingStatus";
import ChangeType from "../common/ChangeType";
import { isIncluded, isNotNilEmpty, sanitiseFormData } from "../../../utils";
import { roleUpdateMetaData } from "../common/roleUpdateMetaData";
import NewPositionDetails from "../common/NewPositionDetails";
import AgreementDetails from "../common/AgreementDetails";
import ITDetails from "../common/ITDetails";
import FinanceDetails from "../../common/FinanceDetails";
import { submitRoleUpdateForm } from "../../../apis/kilnBackendApis";
import { roleUpdateSchema } from "../common/roleUpdateSchema";

const RoleUpdateCreate = ({ employees }) => {
  const currentUser = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    mode: "all",
    resolver: yupResolver(roleUpdateSchema),
    shouldUnregister: true,
    defaultValues: {
      teamviewerLicenseType:
        "TeamViewer Lite - Up to 19 connections per month ($1000)",
      tableauAccessType: "Viewer"
    }
  });
  form.watch();

  // get users from backend
  const [allUsers, setAllUsers] = useState([]);
  useEffect(() => {
    const processUsers = async () => {
      const users = employees;
      const activeUsers = users
        .filter(
          user =>
            user.isADAccountEnabled && isNotNilEmpty(user.payglobalUsername)
        )
        .map(user => ({
          ...user,
          userFullName: `${user.firstName} ${user.surname}`,
          managerFullName: user.manager
            ? `${user.manager?.firstName} ${user.manager?.surname}`
            : ""
        }));
      setAllUsers(activeUsers);
    };
    processUsers().catch(err => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const history = useNavigate();

  const onSubmit = async data => {
    setLoading(true);
    try {
      const sanitisedFormData = {
        employeeId: data.employee.id,
        ...sanitiseFormData(data)
      };
      const response = await submitRoleUpdateForm(sanitisedFormData);
      setLoading(false);
      if (response.status === HttpStatus.CREATED) {
        history("/success", {
          messages: ["Role Update form has been successfully submitted."],
          button: {
            clickUrl: "/form/role-update/list"
          }
        });
        return;
      }
      if (response.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
        history("/error");
        return;
      }
      history("/error", { messages: [response.body.message] });
    } catch (err) {
      history("/error");
    }
  };

  const selectedThirdPartyChange = form.getValues(
    roleUpdateMetaData.changeType.thirdPartyChangeType.NAME
  );
  const selectedPermanentChange = form.getValues(
    roleUpdateMetaData.changeType.permanentChangeType.NAME
  );
  const selectedSecondmentChange = form.getValues(
    roleUpdateMetaData.changeType.secondmentChangeType.NAME
  );
  const selectedFixedTermChange = form.getValues(
    roleUpdateMetaData.changeType.fixedTermChangeType.NAME
  );
  const selectedCasualChange = form.getValues(
    roleUpdateMetaData.changeType.casualChangeType.NAME
  );
  const selectedParentalLeaveChange = form.getValues(
    roleUpdateMetaData.changeType.parentalLeaveChangeType.NAME
  );

  // This section always shown unless it was a reporting line change or
  // 3rd party contract extension
  const [showAgreementDetails, setShowAgreementDetails] = useState(false);
  useEffect(() => {
    if (
      selectedPermanentChange ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[3].label ||
      selectedFixedTermChange ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[4].label ||
      selectedThirdPartyChange ===
        roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[2].label ||
      selectedThirdPartyChange ===
        roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[3].label ||
      selectedSecondmentChange ===
        roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[3].label ||
      selectedCasualChange ===
        roleUpdateMetaData.changeType.casualChangeType.OPTIONS[2].label ||
      selectedParentalLeaveChange ===
        roleUpdateMetaData.changeType.parentalLeaveChangeType.OPTIONS[0].label
    ) {
      setShowAgreementDetails(false);
    } else {
      setShowAgreementDetails(true);
    }
  }, [
    selectedPermanentChange,
    selectedThirdPartyChange,
    selectedSecondmentChange,
    selectedFixedTermChange,
    selectedCasualChange,
    selectedParentalLeaveChange
  ]);

  // Only show the submit button once the user clicked the "approve" button
  // or the 3rd party contractor SLA acknowledgement button
  const approvedValue = form.getValues(
    roleUpdateMetaData.changeType.changeApproved.NAME
  );
  const acknowledgedValue = form.getValues(
    roleUpdateMetaData.changeType.contractorAcknowledged.NAME
  );
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  useEffect(() => {
    if (
      isIncluded(
        approvedValue,
        roleUpdateMetaData.changeType.changeApproved.OPTIONS[0].name
      ) ||
      isIncluded(
        acknowledgedValue,
        roleUpdateMetaData.changeType.contractorAcknowledged.OPTIONS[0].name
      )
    ) {
      setShowSubmitButton(true);
    } else {
      setShowSubmitButton(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvedValue, acknowledgedValue]);

  // This section is always shown unless it was a reporting line change,
  // change to terms of current role, or 3rd party contract extension
  const [showFinanceDetails, setShowFinanceDetails] = useState(false);
  useEffect(() => {
    if (
      selectedPermanentChange ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[2].label ||
      selectedPermanentChange ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[3].label ||
      selectedFixedTermChange ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[3].label ||
      selectedFixedTermChange ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[4].label ||
      selectedThirdPartyChange ===
        roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[2].label ||
      selectedThirdPartyChange ===
        roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[3].label ||
      selectedSecondmentChange ===
        roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[2].label ||
      selectedSecondmentChange ===
        roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[3].label ||
      selectedCasualChange ===
        roleUpdateMetaData.changeType.casualChangeType.OPTIONS[2].label ||
      selectedParentalLeaveChange ===
        roleUpdateMetaData.changeType.parentalLeaveChangeType.OPTIONS[0].label
    ) {
      setShowFinanceDetails(false);
    } else {
      setShowFinanceDetails(true);
    }
  }, [
    selectedPermanentChange,
    selectedThirdPartyChange,
    selectedSecondmentChange,
    selectedFixedTermChange,
    selectedCasualChange,
    selectedParentalLeaveChange
  ]);

  // This section is always shown unless it was a reporting line change,
  // change to terms of current role, 3rd party contract extension,
  // fixed-term to permanent, fixed-term contract extension,
  // or any type of secondment change
  const [showItDetails, setShowItDetails] = useState(false);
  useEffect(() => {
    if (
      selectedPermanentChange ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[2].label ||
      selectedPermanentChange ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[3].label ||
      selectedFixedTermChange ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[0].label ||
      selectedFixedTermChange ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[1].label ||
      selectedFixedTermChange ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[3].label ||
      selectedFixedTermChange ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[4].label ||
      selectedThirdPartyChange ===
        roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[2].label ||
      selectedThirdPartyChange ===
        roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[3].label ||
      selectedSecondmentChange ===
        roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[0].label ||
      selectedSecondmentChange ===
        roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[1].label ||
      selectedSecondmentChange ===
        roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[2].label ||
      selectedSecondmentChange ===
        roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[3].label ||
      selectedCasualChange ===
        roleUpdateMetaData.changeType.casualChangeType.OPTIONS[2].label ||
      selectedParentalLeaveChange ===
        roleUpdateMetaData.changeType.parentalLeaveChangeType.OPTIONS[0].label
    ) {
      setShowItDetails(false);
    } else {
      setShowItDetails(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedPermanentChange,
    selectedThirdPartyChange,
    selectedSecondmentChange,
    selectedFixedTermChange,
    selectedCasualChange,
    selectedParentalLeaveChange
  ]);

  return (
    <>
      {isNil(currentUser) && <CardWithLoadingStatus />}
      {!isNil(currentUser) && (
        <FormProvider {...form}>
          <FormHorizontal layout="primary">
            <form>
              <div className={loading ? "hidden" : "shown"}>
                <PageHead title="Role Update / Transfer Form" />
                <WarningMessage />
                <EmployeeName users={allUsers} />
                <ChangeType />
                {isIncluded(
                  form.getValues(
                    roleUpdateMetaData.changeType.changeApproved.NAME
                  ),
                  roleUpdateMetaData.changeType.changeApproved.OPTIONS[0].name
                ) && (
                  <>
                    <NewPositionDetails users={allUsers} />
                    {showAgreementDetails && <AgreementDetails />}
                    {showFinanceDetails && <FinanceDetails />}
                    {showItDetails && <ITDetails users={allUsers} />}
                  </>
                )}

                <ButtonRow>
                  <Button type="secondary" onClick={() => history(-1)}>
                    Cancel
                  </Button>
                  {showSubmitButton && (
                    <Button onClick={form.handleSubmit(onSubmit)}>
                      Submit
                    </Button>
                  )}
                </ButtonRow>
              </div>
              <div>
                {loading && (
                  <PageState
                    title="Please wait..."
                    description="Role Update form is submitting"
                    image={<Spinner size="medium" />}
                  ></PageState>
                )}
              </div>
            </form>
          </FormHorizontal>
        </FormProvider>
      )}
    </>
  );
};

export default RoleUpdateCreate;
