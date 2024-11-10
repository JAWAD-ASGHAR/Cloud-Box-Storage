"use client"

import { FileRefreshContext } from "@/Context/FileRefreshContext";
import React, { useState } from "react";

const FileRefreshContextWrapper = ({ children }) => {
  const [fileRefresh, setFileRefresh] = useState(false);

  return (
      <FileRefreshContext.Provider value={{ fileRefresh, setFileRefresh }}>
        {children}
      </FileRefreshContext.Provider>
  );
};

export default FileRefreshContextWrapper;
