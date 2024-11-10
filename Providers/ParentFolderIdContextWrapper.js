"use client"

import React, { useState } from "react";
import { ParentFolderIdContext } from "@/Context/ParentFolderIdContext";

const ParentFolderIdContextWrapper = ({ children }) => {
  const [parentFolderId, setParentFolderId] = useState(0);

  return (
    <ParentFolderIdContext.Provider value={{ parentFolderId, setParentFolderId }}>
        {children}
    </ParentFolderIdContext.Provider>
  );
};

export default ParentFolderIdContextWrapper;
