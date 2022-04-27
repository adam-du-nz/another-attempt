import React, { useState, useEffect } from "react";
import { isNil } from "ramda";

import { EEFormSearch } from "./form-fields";
import { commonMetaData } from "./commonMetaData";
import { getPositionTitles } from "../../apis/kilnBackendApis";
import { useFormContext } from "react-hook-form";

const PositionTitle = ({ jobData, addNewPositionFn, disabled }) => {
  const { setValue, register } = useFormContext();

  useEffect(() => {
    if (!isNil(jobData)) {
      setValue(commonMetaData.positionTitle.NAME, {
        positionTitle: jobData.positionTitle
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobData]);

  const [allPositionTitles, setAllPositionTitles] = useState([]);
  useEffect(() => {
    const fetchPositionTitles = async () => {
      const result = (await getPositionTitles()).data;
      const positions = result.map(p => {
        return { positionTitle: p };
      });
      setAllPositionTitles(positions);
    };
    fetchPositionTitles().catch(err => console.log(err));
  }, []);

  return (
    <>
      <input
        name={`_${commonMetaData.positionTitle.NAME}`}
        hidden={true}
        {...register(`_${commonMetaData.positionTitle.NAME}`)}
      />
      <EEFormSearch
        name={commonMetaData.positionTitle.NAME}
        label={commonMetaData.positionTitle.LABEL}
        transform={{
          output: e => {
            const destructTitle = e?.positionTitle;
            return destructTitle ? destructTitle : "";
          }
        }}
        items={allPositionTitles}
        metaData={[{ columnName: "positionTitle", showData: true }]}
        hintText={"Select an position"}
        disabled={disabled}
        addNewItem={{
          label: "Add new position",
          onAddNew: value => {
            addNewPositionFn(value);
          }
        }}
      ></EEFormSearch>
    </>
  );
};

export default PositionTitle;
