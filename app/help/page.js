"use client";

import React, { useContext, useEffect } from "react";
import SearchBar from "@/Components/SearchBar";
import { ParentFolderIdContext } from "@/Context/ParentFolderIdContext";
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaInstagramSquare } from "react-icons/fa";

const Page = () => {
  const { setParentFolderId } = useContext(ParentFolderIdContext);

  useEffect(() => {
    setParentFolderId(0);
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-100 to-slate-200 p-5">
        <SearchBar />
        
        <div className="flex flex-col items-center bg-white mt-5 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Need Help?</h2>
          
          <p className="text-center text-gray-600 max-w-md mb-4">
            If you have any issues, questions, or feedback, feel free to reach out. We’re here to help!
          </p>
          
          <a
            href="mailto:connect.jawadasghar@gmail.com"
            className="text-blue-600 underline hover:text-blue-500 transition-colors"
          >
            connect.jawadasghar@gmail.com
          </a>
          
          <p className="text-center text-gray-600 mt-6">Connect with me on social media:</p>
          
          <div className="flex items-center space-x-6 mt-5">
            <a
              href="https://github.com/JAWAD-ASGHAR"
              className="text-gray-600 hover:text-orange-500 transition-colors flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={24} className="mr-2" />
              <span className="hidden sm:inline">Github</span>
            </a>
            <a
              href="https://instagram.com/jawad_selectives"
              className="text-gray-600 hover:text-pink-500 transition-colors flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagramSquare size={24} className="mr-2" />
              <span className="hidden sm:inline">Instagram</span>
            </a>
            <a
              href="https://www.linkedin.com/in/jawad-asghar-a1290028b/"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin size={24} className="mr-2" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
