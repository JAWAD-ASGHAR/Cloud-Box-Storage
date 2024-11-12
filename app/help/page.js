"use client";

import React, { useContext, useEffect } from "react";
import SearchBar from "@/Components/SearchBar";
import { ParentFolderIdContext } from "@/Context/ParentFolderIdContext";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const Page = () => {
  const { setParentFolderId } = useContext(ParentFolderIdContext);

  useEffect(() => {
    setParentFolderId(0);
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col bg-slate-100 p-5">
        <SearchBar />
        
        {/* Main Help Card */}
        <div className="flex flex-col items-center w-full mx-auto bg-white rounded-xl p-8 mt-5">
          
          {/* Title */}
          <h2 className="text-3xl mt-5 font-bold text-gray-800 mb-2 text-center">
            Need Support?
          </h2>
          <p className="text-gray-600 text-center mb-6">
            We're here to help you with any questions or issues. Don’t hesitate to reach out!
          </p>
          
          {/* Contact Button */}
          <a
            href="mailto:connect.jawadasghar@gmail.com"
            className="text-lg text-white bg-blue-600 px-6 py-2 rounded-full hover:bg-blue-700 transition-colors mb-8"
          >
            Contact Us
          </a>

          {/* Divider */}
          <hr className="border-gray-300 w-full my-6" />

          {/* Social Media Section */}
          <p className="text-gray-700 mb-4">Follow me on:</p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://github.com/JAWAD-ASGHAR"
              className="text-gray-600 hover:text-orange-600 transition-colors flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={30} />
            </a>
            <a
              href="https://instagram.com/jawad_selectives"
              className="text-gray-600 hover:text-pink-600 transition-colors flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={30} />
            </a>
            <a
              href="https://www.linkedin.com/in/jawad-asghar-a1290028b/"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin size={30} />
            </a>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} CloudBox. All rights reserved.</p>
          <p className="mt-1">Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </>
  );
};

export default Page;
