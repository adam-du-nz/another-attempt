import { DropZone, FileChip } from "@myob/myob-widgets";
import { remove } from "ramda";
import { useFormContext, Controller } from "react-hook-form";
import HttpStatus from "http-status-codes";
import React, { useState, useContext } from "react";
import { StatusContext } from "../../../entities/StatusContext";
import { uploadFile } from "../../../apis/kilnBackendApis";
import { fixFileName } from "../../../utils";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const EEFormDropZone = ({ name }) => {
  const [fileProps, setFileProps] = useState([]);
  const { control, formState: { errors } } = useFormContext();
  const [status] = useContext(StatusContext);
  const error = errors[name]?.message;
  const checkAndUploadFile = async file => {
    const fixedName = fixFileName(file.name);
    if (file.size > MAX_FILE_SIZE) {
      const fileProp = {
        id: file.name,
        name: file.name,
        size: file.size,
        state: "failed",
        error: "File too large, size is limited to 10 megabytes."
      };
      return fileProp;
    }
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("filename", fixedName);
      const resp = await uploadFile(data);
      if (resp.status === HttpStatus.CREATED) {
        const fileName = resp.data.filename;
        const finished = {
          id: fixedName,
          state: "finished",
          name: fixedName,
          size: file.size,
          uploadedName: fileName
        };
        return finished;
      } else {
        const failed = {
          id: file.name,
          error:
            "We’ve encountered an error. Please check back again later – if the issue persists, contact MYOB support.",
          state: "failed",
          name: file.name,
          size: file.size
        };
        return failed;
      }
    } catch (err) {
      const errorMessage = {
        id: file.name,
        error:
          "We’ve encountered an error. Please check back again later – if the issue persists, contact MYOB support.",
        state: "failed",
        name: file.name,
        size: file.size
      };
      return errorMessage;
    }
  };

  const onFilesSelectedOrDrop = async (files, value, onChange) => {
    const queued = files.map(file => ({
      name: file.name,
      size: file.size,
      state: "queued"
    }));
    setFileProps(fileProps.concat(queued));
    const uploaded = await Promise.all(files.map(checkAndUploadFile));
    setFileProps(fileProps.concat(uploaded));
    const newArray = value.concat(
      uploaded.map(p => ({
        originName: p.name,
        uploadedName: p.uploadedName,
        size: p.size
      }))
    );
    onChange(newArray);
  };
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value = [] } }) => {
          return (
            <DropZone
              onDrop={async files =>
                await onFilesSelectedOrDrop(files, value, onChange)
              }
              onFileSelected={async files =>
                await onFilesSelectedOrDrop(files, value, onChange)
              }
            >
              {fileProps.map((file, index, array) => (
                <FileChip
                  key={`${file.name}-${index}`}
                  {...file}
                  onRemove={
                    status.disabled
                      ? null
                      : param => {
                          const newArray = remove(index, 1, array);
                          setFileProps(newArray);
                          const removedArray = remove(index, 1, value);
                          onChange(removedArray);
                        }
                  }
                />
              ))}
            </DropZone>
          );
        }}
      />
      {error && <p className="error-message">{error}</p>}
    </>
  );
};

export default EEFormDropZone;
