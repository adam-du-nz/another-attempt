import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  EEFormSelect,
  EEFormSearch,
  EEFormCheckbox
} from "../common/form-fields";
import { arrayExtractor } from "../../utils";
import { getProjectCostCentres } from "../../apis/kilnBackendApis";
import { commonMetaData } from "./commonMetaData";

export default function ProjectCostCentres({ name, label, hintText }) {
  const { getValues } = useFormContext();
  const [allProjectCostCentres, setAllProjectCostCentres] = useState([]);
  const [validProjects, setValidProjects] = useState([]);

  useEffect(() => {
    const fetchProjectCostCentres = async () => {
      const result = (await getProjectCostCentres()).data;
      const costCentres = result.map(c => {
        return { costCentre: c };
      });
      setAllProjectCostCentres(costCentres);
    };
    fetchProjectCostCentres().catch(err => console.log(err));
  }, []);

  const projectType = getValues(
    commonMetaData.projectCostCentres.projectType.NAME
  );
  const codeRequired = arrayExtractor(
    getValues(commonMetaData.projectCostCentres.codeRequired.NAME)
  );

  useEffect(() => {
    if (
      codeRequired ===
      commonMetaData.projectCostCentres.codeRequired.OPTIONS[0].name
    ) {
      if (String(projectType) === "One off project (below the line)") {
        const btlCodes = allProjectCostCentres.filter(p =>
          p.costCentre.startsWith("BTL")
        );
        setValidProjects(btlCodes);
      } else if (String(projectType) === "Capital project (capex)") {
        const cpxCodes = allProjectCostCentres.filter(p =>
          p.costCentre.startsWith("CPX")
        );
        setValidProjects(cpxCodes);
      } else if (String(projectType) === "BAU project (reporting only)") {
        const bauCodes = allProjectCostCentres.filter(p =>
          p.costCentre.startsWith("BAU")
        );
        setValidProjects(bauCodes);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValidProjects, projectType, codeRequired]);

  return (
    <>
      <EEFormCheckbox
        name={commonMetaData.projectCostCentres.codeRequired.NAME}
        label={commonMetaData.projectCostCentres.codeRequired.LABEL}
        options={commonMetaData.projectCostCentres.codeRequired.OPTIONS}
      ></EEFormCheckbox>
      {codeRequired ===
        commonMetaData.projectCostCentres.codeRequired.OPTIONS[0].name && (
        <>
          <EEFormSelect
            name={commonMetaData.projectCostCentres.projectType.NAME}
            label={commonMetaData.projectCostCentres.projectType.LABEL}
            options={commonMetaData.projectCostCentres.projectType.OPTIONS}
            placeholder={"Select an option"}
          ></EEFormSelect>
          <EEFormSearch
            name={commonMetaData.projectCostCentres.projectCostCentre.NAME}
            label={commonMetaData.projectCostCentres.projectCostCentre.LABEL}
            items={validProjects}
            metaData={[{ columnName: "costCentre", showData: true }]}
            hintText={"Select Cost Centre"}
          ></EEFormSearch>
        </>
      )}
    </>
  );
}
