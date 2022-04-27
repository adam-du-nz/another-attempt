import React, { useCallback, useEffect, useContext } from "react";
import { StatusContext } from "../../../entities/StatusContext";
import { FileChip, UploadLgIcon, Field, Box } from "@myob/myob-widgets";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { remove } from "ramda";
import HttpStatus from "http-status-codes";
import { uploadFile } from "../../../apis/kilnBackendApis";
import { fixFileName } from "../../../utils";
import * as styles from "./EEFormFileInput.treat";

/** Default max size 10MB */
const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024;
/** Default file type - documents and images */
const DEFAULT_ACCEPTED_FILE_TYPE =
  "image/*,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf";

const EEFormFileInput = props => {
  const { name, label } = props;
  const [status] = useContext(StatusContext);
  const MAX_FILE_SIZE = props.maxSize ?? DEFAULT_MAX_FILE_SIZE;
  const {
    register,
    unregister,
    getValues,
    setValue,
    formState: { errors }
  } = useFormContext();
  const errorMessage = errors[name]?.message;
  const promptMessage = props?.promptMessage;
  const files = getValues(name);
  const checkAndUploadFile = async file => {
    const fixedName = fixFileName(file.name);
    if (file.size > MAX_FILE_SIZE) {
      const fileProp = {
        id: file.name,
        name: file.name,
        size: file.size,
        state: "failed",
        error: `File too large, size is limited to ${
          MAX_FILE_SIZE * 0.001
        } kbs.`
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
    } catch (e) {
      const error = {
        id: file.name,
        error:
          "We’ve encountered an error. Please check back again later – if the issue persists, contact MYOB support.",
        state: "failed",
        name: file.name,
        size: file.size
      };
      return error;
    }
  };

  const onDrop = useCallback(
    droppedFiles => {
      onFilesSelectedOrDrop(droppedFiles);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setValue, name]
  );

  const onFilesSelectedOrDrop = async acceptedFiles => {
    let newFiles = [...(files || []), ...acceptedFiles];
    newFiles = newFiles.reduce((prev, file) => {
      const fo = Object.entries(file);
      if (
        prev.find(e => {
          const eo = Object.entries(e);
          return eo.every(
            ([key, value], index) =>
              key === fo[index][0] && value === fo[index][1]
          );
        })
      ) {
        return prev;
      } else {
        return [...prev, file];
      }
    }, []);

    const currentUploadInputValue = getValues(name) ?? [];
    const uploaded = await Promise.all(newFiles.map(checkAndUploadFile));
    const uploadedFileArray = currentUploadInputValue.concat(
      uploaded.map(p => ({
        originalName: p.name,
        uploadedName: p.uploadedName,
        size: p.size
      }))
    );
    setValue(name, uploadedFileArray, {
      shouldValidate: true
    });
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: props.accept ?? DEFAULT_ACCEPTED_FILE_TYPE
    // noKeyboard: true
  });
  useEffect(() => {
    register(name);
    return () => {
      unregister(name);
    };
  }, [register, unregister, name]);

  return (
    <>
      <Field
        label={label || ""}
        renderField={() => (
          <>
            <div className={styles.dropzone}>
              <div
                className={
                  isDragActive
                    ? styles.dropzoneBorderActive
                    : styles.dropzoneBorder
                }
                disabled={status.disabled}
              >
                <div {...getRootProps()}>
                  <div
                    className={styles.dropzoneContainer}
                    disabled={status.disabled}
                  >
                    <Box>
                      <Box display="flex" justifyContent="center">
                        <UploadLgIcon />
                      </Box>
                      <Box display="flex" justifyContent="center">
                        <span className="file-browser-label-wrapper">
                          Drag files here to upload, or{" "}
                          <span className={styles.fileBrowserHyperText}>
                            browse for files
                          </span>
                        </span>
                        <input
                          {...props}
                          id={name}
                          disabled={status.disabled}
                          {...getInputProps()}
                        />
                      </Box>
                    </Box>
                    <div className="file-browser"></div>

                    {!!files?.length && (
                      <div style={{ width: "300px" }}>
                        {files.map((file, index, array) => {
                          return (
                            <FileChip
                              key={`${file.originalName}-${index}`}
                              name={`${file.originalName}`}
                              {...file}
                              onRemove={
                                status.disabled
                                  ? null
                                  : param => {
                                      const newArray = remove(index, 1, array);
                                      setValue(name, newArray, {
                                        shouldValidate: true
                                      });
                                    }
                              }
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {promptMessage && (
                <p className="sub-header text-left">{promptMessage}</p>
              )}

              {errorMessage && (
                <div>
                  <span className="error-message">{errorMessage}</span>
                </div>
              )}
            </div>
          </>
        )}
      />
    </>
  );
};

export default EEFormFileInput;
