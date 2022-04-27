import { uniq } from "ramda";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { EEFormSearch } from "./form-fields";
import { getFunctions } from "../../apis/kilnBackendApis";

export default function PositionFunctionDetails({
  functionName,
  functionLabel,
  groupName,
  groupLabel,
  departmentName,
  departmentLabel,
  teamName,
  teamLabel
}) {
  const { getValues, setValue } = useFormContext();

  // Calculate functions
  const [functionData, setFunctionData] = useState([]);
  useEffect(() => {
    const fetchFunctions = async () => {
      const functionResult = (await getFunctions()).data;
      setFunctionData(functionResult);
    };
    fetchFunctions().catch(err => console.log(err));
  }, []);
  const functionList = uniq(
    functionData.map(f => {
      return { function: f.function };
    })
  );

  // Calculate groups
  const currentFunction = getValues(functionName);
  const [groupsList, setGroupsList] = useState([]);
  useEffect(() => {
    const currentFunctionGroups = uniq(
      functionData
        .filter(f => f.function === currentFunction?.function)
        .map(f => {
          return { group: f.group };
        })
    );
    setGroupsList(currentFunctionGroups);
  }, [functionData, currentFunction, setValue]);

  // Calculate departments
  const currentGroup = getValues(groupName);
  const [departmentsList, setDepartmentsList] = useState([]);
  useEffect(() => {
    const currentGroupDepartments = uniq(
      functionData
        .filter(f => f.group === currentGroup?.group)
        .map(f => {
          return { department: f.department };
        })
    );
    setDepartmentsList(currentGroupDepartments);
  }, [functionData, currentGroup, setValue]);

  // Calculate teams
  const currentDepartment = getValues(departmentName);
  const [teamsList, setTeamsList] = useState([]);
  useEffect(() => {
    const currentDepartmentTeams = uniq(
      functionData
        .filter(f => f.department === currentDepartment?.department)
        .map(f => {
          return { team: f.team };
        })
    );
    setTeamsList(currentDepartmentTeams);
  }, [functionData, currentDepartment, setValue]);

  return (
    <>
      <EEFormSearch
        name={functionName}
        label={functionLabel}
        items={functionList}
        metaData={[{ columnName: "function", showData: true }]}
        hintText={"Select Function"}
      ></EEFormSearch>
      <EEFormSearch
        name={groupName}
        label={groupLabel}
        items={groupsList}
        metaData={[{ columnName: "group", showData: true }]}
        hintText={"Select Group"}
      ></EEFormSearch>
      <EEFormSearch
        name={departmentName}
        label={departmentLabel}
        items={departmentsList}
        metaData={[{ columnName: "department", showData: true }]}
        hintText={"Select Department"}
      ></EEFormSearch>
      <EEFormSearch
        name={teamName}
        label={teamLabel}
        items={teamsList}
        metaData={[{ columnName: "team", showData: true }]}
        hintText={"Select Team"}
      ></EEFormSearch>
    </>
  );
}
