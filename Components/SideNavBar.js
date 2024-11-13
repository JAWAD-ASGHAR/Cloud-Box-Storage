"use client";
import Image from "next/image";
import React, { useState, useContext, useEffect } from "react";
import CreateFolderModal from "./folder/CreateFolderModal";
import menuData from "@/Data/menu";
import { redirect } from "next/navigation";
import UploadFileModal from "./file/UploadFileModal";
import { StorageContext } from "@/Context/StorageContext";

const SideNavBar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFolderModalOpen, setFolderModalOpen] = useState(false);
  const [isFileModalOpen, setFileModalOpen] = useState(false);
  const { usedStorage } = useContext(StorageContext);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (usedStorage > 45) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [usedStorage]);

  const handleMenuClick = (path, index) => {
    setActiveIndex(index);
    redirect(path);
  };

  return (
    <div className="w-[240px] bg-white h-screen sticky top-0 left-0 z-10 shadow-lg shadow-blue-100 p-4 border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center mb-6 pl-2 cursor-pointer">
        <Image width={130} height={0} src="/logo.png" alt="logo" onClick={() => redirect("/")}/>
      </div>

      {/* Action Buttons */}
      <button 
      onClick={() => setFileModalOpen(true)}
      className="flex items-center justify-between w-full bg-primary-500 text-white py-2 px-4 rounded-lg shadow transition-all duration-300 ease-in-out transform hover:bg-primary-600 mb-2">
        <span>Add New File</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
      <button
        onClick={() => setFolderModalOpen(true)}
        className="flex items-center justify-between w-full bg-secondary-500 text-white py-2 px-4 rounded-lg shadow transition-all duration-300 ease-in-out transform hover:bg-secondary-600 mb-4"
      >
        <span>New Folder</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>

      {/* Menu Items */}
      <div className="space-y-1">
        {menuData.map((item, index) => (
          <div
            onClick={() => handleMenuClick(item.path, index)}
            key={index}
            className={`flex items-center gap-3 px-4 py-2 ${
              index === activeIndex ? "bg-gray-200" : ""
            } rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={item.icon}
              />
            </svg>
            <span className="text-gray-700 font-medium">{item.name}</span>
          </div>
        ))}
      </div>
      <UploadFileModal isOpen={isFileModalOpen} onClose={() => setFileModalOpen(false)}/>
      <CreateFolderModal isOpen={isFolderModalOpen} onClose={() => setFolderModalOpen(false)}/>
      
      {/* Storage Warning */}
      {showWarning && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-2 bg-red-200 text-red-700 text-center rounded">
          Warning: You have reached 90% of your storage limit!
        </div>
      )}
    </div>
  );
};

export default SideNavBar;

