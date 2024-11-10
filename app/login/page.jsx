"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      redirect("/");
    }
  }, [session]);

  return (
    <div className="h-screen flex items-center justify-center">
      <button
        onClick={() => signIn("google")}
        className="bg-blue-400 text-white font-bold p-2 px-3 rounded-xl"
      >
        Login with Google
      </button>
    </div>
  );
};

export default page;
