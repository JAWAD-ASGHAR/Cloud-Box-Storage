"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { IoLogOutOutline } from "react-icons/io5";

const UserInfo = () => {
  const { data: session } = useSession();
  return (
    <div>
      {session ? (
        <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
          <Image
            src={session.user.image}
            alt="profile"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h2 className="text-[15px] font-bold">{session.user.name}</h2>
            <h2 className="text-[13px] text-gray-400 mt-[-4px]">
              {session.user.email}
            </h2>
          </div>
        </div>
          <div>
            <button onClick={() => signOut()} className="bg-primary-100 w-10 h-10 text-white rounded-md justify-center items-center flex">
              <IoLogOutOutline className="text-primary-500" size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default UserInfo;
