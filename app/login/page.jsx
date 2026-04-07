"use client";

import Image from "next/image";
import { useState } from "react";

const Page = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMockSignIn = () => {
    window.location.href = '/';
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#e0f7fa] via-[#bbdefb] to-[#d1c4e9]" />

      {/* Content */}
      <div className="relative flex h-full w-full items-center justify-center">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="max-w-md p-8 bg-white rounded-lg shadow-xl transition-all duration-500 transform hover:shadow-2xl text-center"
        >
          <div className="flex flex-col items-center">
            <Image width={40} height={40} src="/favicon.png" alt="Cloud Box" />
            <h1 className="mt-4 text-4xl font-extrabold text-gray-800">
              Cloud Box (UI Preview)
            </h1>
            <p className="text-lg text-center text-gray-600 mt-2">
              Welcome to the UI Preview. No real authentication is required.
            </p>
          </div>
          <button
            onClick={handleMockSignIn}
            className="mt-8 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-transform transform "
          >
            Enter Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
