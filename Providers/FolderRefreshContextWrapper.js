"use client"

import React, { useState } from "react";
import { FolderRefreshContext } from "@/Context/FolderRefreshContext";

const ParentFolderIdContextWrapper = ({ children }) => {
  const [folderRefresh, setFolderRefresh] = useState(false);

  return (
      <FolderRefreshContext.Provider value={{ folderRefresh, setFolderRefresh }}>
        {children}
      </FolderRefreshContext.Provider>
  );
};

export default ParentFolderIdContextWrapper;
