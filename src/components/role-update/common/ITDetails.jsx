import React from "react";
import { useFormContext } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { EEFormCheckbox, EEFormTextArea } from "../../common/form-fields";
import { arrayExtractor, isLocationInPreviewMode } from "../../../utils";
import Card from "../../common/Card";
import { roleUpdateMetaData } from "./roleUpdateMetaData";
import LocalAdminAccess from "../../common/LocalAdminAccess";
import ComputerHardware from "../../common/ComputerHardware";
import PhoneSystems from "../../common/PhoneSystems";
import MobilePhone from "../../common/MobilePhone";
import Software from "../../common/Software";
import NetworkDrives from "../../common/NetworkDrives";
import { pluck, values } from "ramda";

export default function ITDetails({ users }) {
  const { getValues, watch } = useFormContext();
  const toWatch = pluck("NAME", values(roleUpdateMetaData.itDetails));
  watch([...toWatch]);
  const itDetailsPlaceholderText = isLocationInPreviewMode(useLocation())
    ? ""
    : roleUpdateMetaData.itDetails.commentsOnIT.PLACEHOLDER;

  return (
    <Card
      title={"IT Details"}
      body={
        <>
          <LocalAdminAccess />
          <EEFormCheckbox
            name={roleUpdateMetaData.itDetails.computerChange.NAME}
            label={roleUpdateMetaData.itDetails.computerChange.LABEL}
            options={roleUpdateMetaData.itDetails.computerChange.OPTIONS}
          ></EEFormCheckbox>
          {arrayExtractor(
            getValues(roleUpdateMetaData.itDetails.computerChange.NAME)
          ) === roleUpdateMetaData.itDetails.computerChange.OPTIONS[0].name && (
            <ComputerHardware />
          )}
          <EEFormCheckbox
            name={roleUpdateMetaData.itDetails.phoneSystemChange.NAME}
            label={roleUpdateMetaData.itDetails.phoneSystemChange.LABEL}
            options={roleUpdateMetaData.itDetails.phoneSystemChange.OPTIONS}
          ></EEFormCheckbox>
          {arrayExtractor(
            getValues(roleUpdateMetaData.itDetails.phoneSystemChange.NAME)
          ) ===
            roleUpdateMetaData.itDetails.phoneSystemChange.OPTIONS[0].name && (
            <PhoneSystems employees={users} />
          )}
          <MobilePhone />
          <EEFormCheckbox
            name={roleUpdateMetaData.itDetails.softwareChange.NAME}
            label={roleUpdateMetaData.itDetails.softwareChange.LABEL}
            options={roleUpdateMetaData.itDetails.softwareChange.OPTIONS}
          ></EEFormCheckbox>
          {arrayExtractor(
            getValues(roleUpdateMetaData.itDetails.softwareChange.NAME)
          ) === roleUpdateMetaData.itDetails.softwareChange.OPTIONS[0].name && (
            <>
              <NetworkDrives />
              <Software employees={users} />
            </>
          )}
          <EEFormTextArea
            name={roleUpdateMetaData.itDetails.commentsOnIT.NAME}
            label={roleUpdateMetaData.itDetails.commentsOnIT.LABEL}
            placeholder={itDetailsPlaceholderText}
          ></EEFormTextArea>
        </>
      }
    />
  );
}
