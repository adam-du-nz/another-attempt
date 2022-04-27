import { intersection, isNil } from "ramda";
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import {
  EEFormCheckbox,
  EEFormSearch,
  EEFormTextArea,
  EEFormFileInput
} from "../../common/form-fields";
import { commonMetaData } from "../../common/commonMetaData";
import { arrayExtractor, isNotNilEmpty } from "../../../utils";
import Card from "../../common/Card";
import CostCentres from "../../common/CostCentres";
import PositionOrganisationDetails from "./PositionOrganisationDetails";
import PositionTitle from "../../common/PositionTitle";
import ProjectCostCentres from "../../common/ProjectCostCentres";
import TeamMemberLevel from "../../common/TeamMemberLevel";
import { roleUpdateMetaData } from "./roleUpdateMetaData";
import CarAllowance from "./CarAllowance";
import NewPositionWarningMessage from "./NewPositionWarningMessage";
import ReportingLineChange from "./ReportingLineChange";
import sanitizeHTML from "sanitize-html";

export default function NewPositionDetails({ users }) {
  const { getValues, setValue } = useFormContext();
  const location = useLocation();
  const currentPathname = location?.pathname.toLowerCase();
  const isEditOrPreviewMode = isNotNilEmpty(
    intersection(currentPathname, ["edit", "preview"])
  );
  const [showNewPositionWarning, setShowNewPositionWarning] = useState(false);
  const addNewPosition = value => {
    if (isNotNilEmpty(value)) {
      const sanitisedValue = sanitizeHTML(value);
      setValue(`_${commonMetaData.positionTitle.NAME}`, sanitisedValue, {
        shouldDirty: true
      });
      setShowNewPositionWarning(true);
    }
  };

  const [isReportingLineChange, setIsReportingLineChange] = useState(false);
  const [isTransferToCasual, setIsTransferToCasual] = useState(false);
  const [isChangeOfTerms, setIsChangeOfTerms] = useState(false);
  const selectedPermanentChange = getValues(
    roleUpdateMetaData.changeType.permanentChangeType.NAME
  );
  const selectedSecondmentChange = getValues(
    roleUpdateMetaData.changeType.secondmentChangeType.NAME
  );
  const selectedFixedTermChange = getValues(
    roleUpdateMetaData.changeType.fixedTermChangeType.NAME
  );
  const selectedThirdPartyChange = getValues(
    roleUpdateMetaData.changeType.thirdPartyChangeType.NAME
  );
  const selectedCasualChange = getValues(
    roleUpdateMetaData.changeType.casualChangeType.NAME
  );
  const selectedParentalLeaveChange = getValues(
    roleUpdateMetaData.changeType.parentalLeaveChangeType.NAME
  );
  useEffect(() => {
    if (
      selectedPermanentChange ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[3].label ||
      selectedSecondmentChange ===
        roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[3].label ||
      selectedFixedTermChange ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[4].label ||
      selectedThirdPartyChange ===
        roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[3].label ||
      selectedCasualChange ===
        roleUpdateMetaData.changeType.casualChangeType.OPTIONS[2].label ||
      selectedParentalLeaveChange ===
        roleUpdateMetaData.changeType.parentalLeaveChangeType.OPTIONS[0].label
    ) {
      setIsReportingLineChange(true);
    } else {
      setIsReportingLineChange(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedPermanentChange,
    selectedSecondmentChange,
    selectedFixedTermChange,
    selectedThirdPartyChange,
    selectedCasualChange
  ]);

  useEffect(() => {
    if (
      selectedPermanentChange ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[2].label ||
      selectedSecondmentChange ===
        roleUpdateMetaData.changeType.secondmentChangeType.OPTIONS[2].label ||
      selectedFixedTermChange ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[3].label
    ) {
      setIsChangeOfTerms(true);
    } else {
      setIsChangeOfTerms(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedPermanentChange,
    selectedSecondmentChange,
    selectedFixedTermChange
  ]);

  useEffect(() => {
    setIsTransferToCasual(false);
    if (
      selectedPermanentChange ===
      roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[5].label
    ) {
      setIsTransferToCasual(true);
    }
  }, [selectedPermanentChange]);

  // pre-populate fields only when creating the form based on the current user
  const employee = getValues(
    roleUpdateMetaData.employeeDetails.employeeName.NAME
  );
  useEffect(() => {
    if (
      isNotNilEmpty(employee) &&
      isNotNilEmpty(users) &&
      !isEditOrPreviewMode
    ) {
      const currentTeamMemberLevel = commonMetaData.teamMemberLevel.OPTIONS.find(
        option => option.label === employee.teamMemberLevel
      );
      setValue(
        commonMetaData.teamMemberLevel.NAME,
        currentTeamMemberLevel.label
      );
      const currentDirectManager = users.find(
        user => user.id === employee.manager.id
      );
      setValue(
        roleUpdateMetaData.newPosition.directManager.NAME,
        currentDirectManager
      );
      setValue(
        `_${commonMetaData.positionTitle.NAME}`,
        employee?.positionTitle
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    employee,
    users,
    selectedPermanentChange,
    selectedSecondmentChange,
    selectedFixedTermChange,
    selectedThirdPartyChange,
    selectedCasualChange,
    isEditOrPreviewMode
  ]);

  // The section title is supposed to be dynamic based on the selected items.
  // Defaults to "Position Details".
  const [sectionTitle, setSectionTitle] = useState("Position Details");
  useEffect(() => {
    if (
      selectedFixedTermChange ===
        roleUpdateMetaData.changeType.fixedTermChangeType.OPTIONS[2].label ||
      selectedPermanentChange ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[0].label ||
      selectedPermanentChange ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[1].label ||
      selectedPermanentChange ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[2].label ||
      selectedPermanentChange ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[4].label ||
      selectedPermanentChange ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[5].label ||
      selectedThirdPartyChange ===
        roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[0].label ||
      selectedThirdPartyChange ===
        roleUpdateMetaData.changeType.thirdPartyChangeType.OPTIONS[1].label ||
      selectedCasualChange ===
        roleUpdateMetaData.changeType.casualChangeType.OPTIONS[0].label ||
      selectedCasualChange ===
        roleUpdateMetaData.changeType.casualChangeType.OPTIONS[1].label
    ) {
      setSectionTitle("New Position Details");
    } else {
      setSectionTitle("Position Details");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedPermanentChange,
    selectedFixedTermChange,
    selectedThirdPartyChange,
    selectedCasualChange
  ]);

  const [
    positionOrganisationDetails,
    setPositionOrganisationDetails
  ] = useState({});

  function getPreviousManager(value) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ref = useRef();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const manager = getValues(roleUpdateMetaData.newPosition.directManager.NAME);
  const previousManager = getPreviousManager(manager);

  useEffect(() => {
    if (!isEditOrPreviewMode) {
      if (
        selectedPermanentChange ===
        roleUpdateMetaData.changeType.permanentChangeType.OPTIONS[0].label
      ) {
        if (
          manager?.userPrincipalName !== previousManager?.userPrincipalName &&
          !isNil(previousManager)
        ) {
          setPositionOrganisationDetails(manager);
        } else {
          setPositionOrganisationDetails(employee);
        }
      } else {
        setPositionOrganisationDetails(manager);
      }
    } else if (
      !isNil(previousManager) &&
      manager?.userPrincipalName !== previousManager?.userPrincipalName
    ) {
      setPositionOrganisationDetails(manager);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPermanentChange, isEditOrPreviewMode, manager]);

  return (
    <Card
      title={sectionTitle}
      body={
        <>
          {/* Reporting line change */}
          {isReportingLineChange === true && (
            <ReportingLineChange users={users} />
          )}
          {/* Any other type of change */}
          {isReportingLineChange === false && (
            <>
              <TeamMemberLevel />
              <PositionTitle
                addNewPositionFn={addNewPosition}
                disabled={isChangeOfTerms}
              />
              {showNewPositionWarning && <NewPositionWarningMessage />}
              {isChangeOfTerms === false && (
                <EEFormFileInput
                  name={"positionDescriptionAttachment"}
                  label={`${
                    isTransferToCasual ? "Casual " : ""
                  }Position Description`}
                />
              )}
              <EEFormSearch
                name={roleUpdateMetaData.newPosition.directManager.NAME}
                label={roleUpdateMetaData.newPosition.directManager.LABEL}
                items={users}
                metaData={[
                  {
                    columnName: "fullName",
                    columnWidth: "150px",
                    showData: true
                  },
                  {
                    columnName: "userPrincipalName",
                    columnWidth: "243px",
                    align: "right"
                  }
                ]}
              ></EEFormSearch>
              <PositionOrganisationDetails
                manager={positionOrganisationDetails}
              />
              <EEFormCheckbox
                name={
                  roleUpdateMetaData.newPosition.costCentreChangeRequired.NAME
                }
                label={
                  roleUpdateMetaData.newPosition.costCentreChangeRequired.LABEL
                }
                options={
                  roleUpdateMetaData.newPosition.costCentreChangeRequired
                    .OPTIONS
                }
              ></EEFormCheckbox>
              {arrayExtractor(
                getValues(
                  roleUpdateMetaData.newPosition.costCentreChangeRequired.NAME
                )
              ) ===
                roleUpdateMetaData.newPosition.costCentreChangeRequired
                  .OPTIONS[0].name && (
                <CostCentres
                  name={roleUpdateMetaData.newPosition.costCentre.NAME}
                  label={roleUpdateMetaData.newPosition.costCentre.LABEL}
                  hintText={"Select new cost centre"}
                />
              )}
              <ProjectCostCentres />
              <EEFormCheckbox
                name={roleUpdateMetaData.newPosition.driversLicence.NAME}
                label={roleUpdateMetaData.newPosition.driversLicence.LABEL}
                options={roleUpdateMetaData.newPosition.driversLicence.OPTIONS}
              ></EEFormCheckbox>
              {arrayExtractor(
                getValues(roleUpdateMetaData.newPosition.driversLicence.NAME)
              ) ===
                roleUpdateMetaData.newPosition.driversLicence.OPTIONS[0]
                  .name && <CarAllowance />}
              <EEFormCheckbox
                name={roleUpdateMetaData.newPosition.onCall.NAME}
                label={roleUpdateMetaData.newPosition.onCall.LABEL}
                options={roleUpdateMetaData.newPosition.onCall.OPTIONS}
              ></EEFormCheckbox>
              <EEFormCheckbox
                name={roleUpdateMetaData.newPosition.shiftWork.NAME}
                label={roleUpdateMetaData.newPosition.shiftWork.LABEL}
                options={roleUpdateMetaData.newPosition.shiftWork.OPTIONS}
              ></EEFormCheckbox>
              <EEFormTextArea
                name={roleUpdateMetaData.newPosition.commentsOnPosition.NAME}
                label={roleUpdateMetaData.newPosition.commentsOnPosition.LABEL}
              ></EEFormTextArea>
            </>
          )}
        </>
      }
    />
  );
}
