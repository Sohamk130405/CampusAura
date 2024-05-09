import React, { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewFile = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [fileName, setFileName] = useState(null); // Add state to store the file name
  const showToast = useShowToast();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileUrl(reader.result);
        setFileName(file.name); // Set the file name
      };
      reader.readAsDataURL(file);
    } else {
      showToast("Invalid file", "Please select a file", "error");
      setFileUrl(null);
      setFileName(null); // Reset file name if no file selected
    }
  };

  return { handleFileChange, fileUrl, fileName, setFileUrl };
};

export default usePreviewFile;
