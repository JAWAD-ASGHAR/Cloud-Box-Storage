"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState , useEffect} from "react";

const Page = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const {data: session} = useSession();
  

  useEffect(() => {
    if (session) {
      redirect("/");
    }
  })

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#e0f7fa] via-[#bbdefb] to-[#d1c4e9]" />
      
      {/* Overlay gradient layer with opacity transition */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-[#f58f4b] via-[#7A7CEE] to-[#cc44e7] transition-opacity duration-1000 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Button overlay gradient layer with opacity transition */}
      <div
        className={`absolute left-0 bottom-0 right-0 bg-black transition-all duration-500 transform ${isButtonHovered ? 'h-full' : 'h-0'}`}
      />
      
      {/* Content */}
      <div className="relative flex h-full w-full items-center justify-center">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="max-w-md p-8 bg-white rounded-lg shadow-xl transition-all duration-500 transform hover:shadow-2xl"
        >
          <div className="flex flex-col items-center">
            <Image
              width={40}
              height={40} 
              src="/favicon.png"
              alt="Cloud Box"
            />
            <h1 className="mt-4 text-4xl font-extrabold text-gray-800">
              Cloud Box
            </h1>
            <p className="text-lg text-center text-gray-600 mt-2">
              Welcome to Cloud Box! Sign in to access your files and folders.
            </p>
          </div>
          <button
            onClick={() => signIn("google")}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="mt-8 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-transform transform "
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
