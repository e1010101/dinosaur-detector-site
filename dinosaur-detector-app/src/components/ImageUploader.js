import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const ImageUploader = ({ onUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      onUpload(acceptedFiles[0]);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={{ border: "2px dashed gray", padding: "2rem" }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here...</p>
      ) : (
        <p>Drag and drop an image here, or click to select an image</p>
      )}
    </div>
  );
};

export default ImageUploader;
