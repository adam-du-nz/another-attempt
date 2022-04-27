import { uniq } from "ramda";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { EEFormSearch } from "./form-fields";
import { getVerticals } from "../../apis/kilnBackendApis";

export default function PositionVerticalDetails({
  verticalName,
  verticalLabel,
  segmentName,
  segmentLabel
}) {
  const { getValues } = useFormContext();

  // Calculate verticals
  const [verticalData, setVerticalData] = useState([]);
  useEffect(() => {
    const fetchVerticals = async () => {
      const verticalResult = (await getVerticals()).data;
      setVerticalData(verticalResult);
    };
    fetchVerticals().catch(err => console.log(err));
  }, []);
  const verticalList = uniq(
    verticalData.map(v => {
      return { vertical: v.vertical };
    })
  );
  // Calculate segments
  const currentVertical = getValues(verticalName);
  const [segmentsList, setSegmentsList] = useState([]);
  useEffect(() => {
    const currentVerticalSegments = uniq(
      verticalData
        .filter(v => v.vertical === currentVertical?.vertical)
        .map(v => {
          return { segment: v.segment };
        })
    );
    setSegmentsList(currentVerticalSegments);
  }, [verticalData, currentVertical]);

  return (
    <>
      <EEFormSearch
        name={verticalName}
        label={verticalLabel}
        items={verticalList}
        metaData={[{ columnName: "vertical", showData: true }]}
        hintText={"Select Vertical"}
      ></EEFormSearch>
      <EEFormSearch
        name={segmentName}
        label={segmentLabel}
        items={segmentsList}
        metaData={[{ columnName: "segment", showData: true }]}
        hintText={"Select Segment"}
      ></EEFormSearch>
    </>
  );
}
