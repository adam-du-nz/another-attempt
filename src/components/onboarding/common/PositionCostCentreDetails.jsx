import React from "react";
import CostCentres from "../../common/CostCentres";
import ProjectCostCentres from "../../common/ProjectCostCentres";
import { onboardingFormMetaData } from "./onboardingFormMetaData";

const PositionCostCentreDetails = () => {
  return (
    <>
      <CostCentres
        name={onboardingFormMetaData.positionDetails.costCentre.NAME}
        label={onboardingFormMetaData.positionDetails.costCentre.LABEL}
        hintText={"Select Cost Centre"}
      />
      <ProjectCostCentres />
    </>
  );
};

export default PositionCostCentreDetails;
