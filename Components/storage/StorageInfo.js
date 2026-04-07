"use client";

import React, { useState } from "react";
import { FaImage, FaVideo, FaFileAlt, FaFile } from "react-icons/fa";

const StorageInfo = () => {
  const [totalSize, setTotalSize] = useState(12.5);
  const totalStorageLimit = 50; // MB

  const [fileStats, setFileStats] = useState({
    Images: { size: 5.2, count: 12 },
    Videos: { size: 3.8, count: 5 },
    Documents: { size: 2.1, count: 8 },
    Others: { size: 1.4, count: 3 },
  });

  const categories = [
    { label: "Images", icon: <FaImage size={24} />, bgColor: "bg-green-100", iconColor: "text-green-500" },
    { label: "Videos", icon: <FaVideo size={24} />, bgColor: "bg-blue-100", iconColor: "text-blue-500" },
    { label: "Documents", icon: <FaFileAlt size={24} />, bgColor: "bg-yellow-100", iconColor: "text-yellow-500" },
    { label: "Others", icon: <FaFile size={24} />, bgColor: "bg-red-100", iconColor: "text-red-500" },
  ];

  const calculateProgress = (size) => {
    return (size / totalStorageLimit) * 100;
  };

  return (
    <div>
      <h2 className="text-[22px] font-bold mb-2 mt-8">
        {totalSize} MB <span className="text-[14px] font-medium text-gray-400">used of</span> 50 MB
      </h2>
      <div className="w-full flex bg-gray-200 h-2.5 mb-5 rounded-full">
        <div
          className="bg-green-500 h-2.5 rounded-l-full"
          style={{ width: `${calculateProgress(fileStats.Images.size)}%` }}
        ></div>
        <div
          className="bg-blue-500 h-2.5"
          style={{ width: `${calculateProgress(fileStats.Videos.size)}%` }}
        ></div>
        <div
          className="bg-yellow-500 h-2.5"
          style={{ width: `${calculateProgress(fileStats.Documents.size)}%` }}
        ></div>
        <div
          className="bg-red-500 h-2.5 rounded-r-full"
          style={{ width: `${calculateProgress(fileStats.Others.size)}%` }}
        ></div>
      </div>

      <div className="space-y-4 border-b border-gray-200 mt-4 mb-4">
        {categories.map((category, index) => (
          <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${category.bgColor}`}>
                {React.cloneElement(category.icon, { className: category.iconColor })}
              </div>
              <div>
                <h4 className="font-medium">{category.label}</h4>
                <p className="text-gray-400 text-sm">{fileStats[category.label]?.count || 0} Files</p>
              </div>
            </div>
            <p className="font-semibold">
              {fileStats[category.label]?.size || 0} MB
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center bg-gray-100 p-5 rounded-lg">
        <p className="text-gray-800 font-semibold">Need More Space?</p>
        <p className="text-gray-600 text-sm">Get more space by upgrading the plan</p>
        <button className="bg-primary-500 text-white mt-3 p-2 rounded-lg transition-all ease-in-out duration-300 hover:bg-primary-600 font flex items-center justify-center">
          Upgrade Plan
        </button>
      </div>
    </div>
  );
};

export default StorageInfo;
