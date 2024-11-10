"use client";

import { app } from "@/Config/FirebaseConfig";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { FaImage, FaVideo, FaFileAlt, FaFile } from "react-icons/fa"; // Import specific icons
import { FileRefreshContext } from "@/Context/FileRefreshContext";

const StorageInfo = () => {
  const db = getFirestore(app);
  const { data: session, status } = useSession();
  const { fileRefresh, setFileRefresh } = useContext(FileRefreshContext);
  const [totalSize, setTotalSize] = React.useState(0);
  const [fileStats, setFileStats] = React.useState({
    Images: { size: 0, count: 0 },
    Videos: { size: 0, count: 0 },
    Documents: { size: 0, count: 0 },
    Others: { size: 0, count: 0 },
  });
  const totalStorageLimit = 50 * 1024 * 1024; // 50 MB in bytes

  useEffect(() => {
    if (status === "authenticated") {
      getAllFiles();
    }
  }, [session, fileRefresh]);

  const categories = [
    { label: "Images", icon: <FaImage size={24} />, bgColor: "bg-green-100", iconColor: "text-green-500" },
    { label: "Videos", icon: <FaVideo size={24} />, bgColor: "bg-blue-100", iconColor: "text-blue-500" },
    { label: "Documents", icon: <FaFileAlt size={24} />, bgColor: "bg-yellow-100", iconColor: "text-yellow-500" },
    { label: "Others", icon: <FaFile size={24} />, bgColor: "bg-red-100", iconColor: "text-red-500" },
  ];

  const getAllFiles = async () => {
    let totalSizeInBytes = 0;
    const newFileStats = {
      Images: { size: 0, count: 0 },
      Videos: { size: 0, count: 0 },
      Documents: { size: 0, count: 0 },
      Others: { size: 0, count: 0 },
    };

    const q = query(
      collection(db, "files"),
      where("createdBy", "==", session?.user?.email)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const fileSize = doc.data()["size"];
      const fileType = doc.data()["type"];

      totalSizeInBytes += fileSize;

      // Categorize files based on type
      if (
        fileType.endsWith("png") ||
        fileType.endsWith("jpg") ||
        fileType.endsWith("jpeg") ||
        fileType.endsWith("gif") ||
        fileType.endsWith("bmp")
      ) {
        newFileStats.Images.size += fileSize;
        newFileStats.Images.count += 1;
      } else if (
        fileType.endsWith("mp4") ||
        fileType.endsWith("mov") ||
        fileType.endsWith("avi") ||
        fileType.endsWith("wmv")
      ) {
        newFileStats.Videos.size += fileSize;
        newFileStats.Videos.count += 1;
      } else if (
        fileType.endsWith("pdf") ||
        fileType.endsWith("docx") ||
        fileType.endsWith("doc") ||
        fileType.endsWith("txt")
      ) {
        newFileStats.Documents.size += fileSize;
        newFileStats.Documents.count += 1;
      } else {
        newFileStats.Others.size += fileSize;
        newFileStats.Others.count += 1;
      }
    });

    setTotalSize((totalSizeInBytes / 1024 ** 2).toFixed(2));
    setFileStats(newFileStats);
  };

  const calculateProgress = (size) => {
    return (size / totalStorageLimit) * 100;
  };

  return (
    <div>
      {/* Storage Progress Section */}
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

      {/* Categories Section */}
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
              {(fileStats[category.label]?.size / 1024 ** 2).toFixed(2) || 0} MB
            </p>
          </div>
        ))}
      </div>

      {/* Upgrade Plan Section */}
      <div className="mt-6 flex flex-col items-center bg-gray-100 p-5 rounded-lg">
        <p className="text-gray-800 font-semibold">Need More Space?</p>
        <p className="text-gray-600 text-sm">Get more space by upgrading the plan</p>
        <button className="bg-primary-500 text-white mt-3 p-2 rounded-lg hover:bg-blue-400 font flex items-center justify-center">
          Upgrade Plan
        </button>
      </div>
    </div>
  );
};

export default StorageInfo;
