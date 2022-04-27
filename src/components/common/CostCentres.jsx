import React, { useState, useEffect } from "react";
import { EEFormSearch } from "../common/form-fields";
import { getCostCentres } from "../../apis/kilnBackendApis";

export default function CostCentres({ name, label, hintText }) {
  const [allCostCentres, setAllCostCentres] = useState([]);
  useEffect(() => {
    const fetchCostCentres = async () => {
      const result = (await getCostCentres()).data;
      const costCentres = result.map(c => {
        return { costCentre: `${c.name} (${c.costCentre})` };
      });
      setAllCostCentres(costCentres);
    };
    fetchCostCentres().catch(err => console.log(err));
  }, []);

  return (
    <>
      <EEFormSearch
        name={name}
        label={label}
        items={allCostCentres}
        metaData={[{ columnName: "costCentre", showData: true }]}
        hintText={hintText}
      ></EEFormSearch>
    </>
  );
}
