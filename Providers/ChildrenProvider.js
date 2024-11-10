"use client";

import SideNavBar from "@/Components/SideNavBar";
import Storage from "@/Components/storage/Storage";
import { useSession } from "next-auth/react";
import React from "react";

const ChildrenProvider = ({ children }) => {
  const { data: session, status } = useSession();

  return (
    <div className="flex">
      {status === "authenticated" && session ? (
        <>
          <SideNavBar />
          <div className="grid grid-cols-1 md:grid-cols-3 w-full">
            {/* Children container spanning two columns on medium screens and up */}
            <div className="col-span-2">{children}</div>
            {/* Storage container spanning one column */}
            <div className="order-first md:order-last">
              <Storage />
            </div>
          </div>
        </>
      ) : (
        status !== "loading" && children
      )}
    </div>
  );
};

export default ChildrenProvider;
