import { isNil } from "ramda";
import React, { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

import PositionFunctionDetails from "../../common/PositionFunctionDetails";
import PositionVerticalDetails from "../../common/PositionVerticalDetails";
import { commonMetaData } from "../../common/commonMetaData";

const PositionOrganisationDetails = ({ manager }) => {
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

  const previousManager = getPreviousManager(manager);

  // Handle changing function and vertical based on the data provided
  useEffect(() => {
    const setDefaultFunctionsAndVerticals = () => {
      if (manager?.userPrincipalName === previousManager?.userPrincipalName) {
        // This should use the default values provided by the form,
        // or set the manager's value if the form doesn't have anything
        if (isNil(getValues("function"))) {
          setValue(functionField, {
            function: manager?.function ? manager?.function : ""
          });
        }
        if (isNil(getValues("group"))) {
          setValue(groupField, { group: manager?.group ? manager.group : "" });
        }
        if (isNil(getValues("department"))) {
          setValue(departmentField, {
            department: manager?.department ? manager.department : ""
          });
        }
        if (isNil(getValues("team"))) {
          setValue(teamField, { team: manager?.team ? manager.team : "" });
        }
        if (isNil(getValues("vertical"))) {
          setValue(verticalField, {
            vertical: manager?.vertical ? manager.vertical : ""
          });
        }
        if (isNil(getValues("segment"))) {
          setValue(segmentField, {
            segment: manager?.segment ? manager.segment : ""
          });
        }
      } else {
        // This should mean that the user explicitly chose a new manager,
        // so we should use the new manager's details
        setValue(functionField, { function: manager.function });
        setValue(groupField, { group: manager.group });
        setValue(departmentField, { department: manager.department });
        setValue(teamField, { team: manager.team });
        setValue(verticalField, { vertical: manager.vertical });
        setValue(segmentField, { segment: manager.segment });
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
