import { isNil } from "ramda";
import React, { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

import PositionFunctionDetails from "../../common/PositionFunctionDetails";
import PositionVerticalDetails from "../../common/PositionVerticalDetails";
import { commonMetaData } from "../../common/commonMetaData";

// 'managerField' is the name of the field to get the manager details from,
// e.g. commonMetaData.directManager.NAME
const PositionOrganisationDetails = ({ managerField }) => {
  const { getValues, setValue } = useFormContext();

  function getPreviousManager(value) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ref = useRef();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const functionField = commonMetaData.function.NAME;
  const groupField = commonMetaData.group.NAME;
  const departmentField = commonMetaData.department.NAME;
  const teamField = commonMetaData.team.NAME;
  const verticalField = commonMetaData.vertical.NAME;
  const segmentField = commonMetaData.segment.NAME;

  const manager = getValues(managerField);
  const previousManager = getPreviousManager(manager);

  // Handle changing function and vertical based on the direct manager
  useEffect(() => {
    const setDefaultFunctionsAndVerticals = () => {
      if (!isNil(manager)) {
        if (isNil(previousManager)) {
          // No previous manager, so either we're on the create form
          // and this is the first manager, or we are on the preview/edit
          // form and should keep the values we just loaded from the backend
          if (isNil(getValues("function"))) {
            setValue(functionField, { function: manager.function });
          }
          if (isNil(getValues("group"))) {
            setValue(groupField, { group: manager.group });
          }
          if (isNil(getValues("department"))) {
            setValue(departmentField, { department: manager.department });
          }
          if (isNil(getValues("team"))) {
            setValue(teamField, { team: manager.team });
          }
          if (isNil(getValues("vertical"))) {
            setValue(verticalField, { vertical: manager.vertical });
          }
          if (isNil(getValues("segment"))) {
            setValue(segmentField, { segment: manager.segment });
          }
        } else if (manager !== previousManager && !isNil(previousManager)) {
          // If user chose a manager, set everything to the new manager
          setValue(functionField, { function: manager.function });
          setValue(groupField, { group: manager.group });
          setValue(departmentField, { department: manager.department });
          setValue(teamField, { team: manager.team });
          setValue(verticalField, { vertical: manager.vertical });
          setValue(segmentField, { segment: manager.segment });
        }
      }
    };
    setDefaultFunctionsAndVerticals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager]);

  return (
    <>
      <PositionFunctionDetails
        functionName={commonMetaData.function.NAME}
        functionLabel={commonMetaData.function.LABEL}
        groupName={commonMetaData.group.NAME}
        groupLabel={commonMetaData.group.LABEL}
        departmentName={commonMetaData.department.NAME}
        departmentLabel={commonMetaData.department.LABEL}
        teamName={commonMetaData.team.NAME}
        teamLabel={commonMetaData.team.LABEL}
      ></PositionFunctionDetails>
      <PositionVerticalDetails
        verticalName={commonMetaData.vertical.NAME}
        verticalLabel={commonMetaData.vertical.LABEL}
        segmentName={commonMetaData.segment.NAME}
        segmentLabel={commonMetaData.segment.LABEL}
      ></PositionVerticalDetails>
    </>
  );
};

export default PositionOrganisationDetails;
