"use client";

import SideNavBar from "@/Components/SideNavBar";
import Storage from "@/Components/storage/Storage";
import { useSession } from "next-auth/react";
import React from "react";

const ChildrenProvider = ({ children }) => {
  const { data: session, status } = useSession();

  return (
    <>
      {status === "authenticated" && session ? (
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
      ) : (
        status !== "loading" && children
      )}
    </>
  );
};

export default ChildrenProvider;
