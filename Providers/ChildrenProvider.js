"use client";

import SideNavBar from "@/Components/SideNavBar";
import Storage from "@/Components/storage/Storage";
import React from "react";

const ChildrenProvider = ({ children }) => {
  return (
    <>
      <div className="flex">
        <SideNavBar />
        <div className="grid grid-cols-1 md:grid-cols-3 w-full">
          <div className="col-span-2">{children}</div>
          <div className="order-first md:order-last ">
            <Storage />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChildrenProvider;
