"use client"

import { ParentFolderIdContext } from "@/Context/ParentFolderIdContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";

const NotFound = () => {

  const { status } = useSession();
  const router = useRouter();
  const {setParentFolderId} = useContext(ParentFolderIdContext);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    setParentFolderId(0);
  }, [status]);

  return (
    <div className="flex h-screen bg-slate-100 items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-2xl">Page not found</p>
        <div className="mt-10">
          <a
            href="/"
            className="bg-primary-500 hover:bg-primary-600 transition-all ease-in-out duration-300 text-white p-3 rounded-lg"
          >
            Go back home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
