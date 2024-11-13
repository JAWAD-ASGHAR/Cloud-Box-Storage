"use client"

import { StorageContext } from "@/Context/StorageContext";
import React, { useState } from "react";

const StorageContextWrapper = ({ children }) => {
  const [usedStorage, setUsedStorage] = useState(false);

  return (
      <StorageContext.Provider value={{ usedStorage, setUsedStorage }}>
        {children}
      </StorageContext.Provider>
  );
};

export default StorageContextWrapper;
