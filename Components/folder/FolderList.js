"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FolderItem from "./FolderItem";
import Toast from "../Toast";

const FolderList = ({ folderList, loading }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastMode, setToastMode] = useState("");
  const router = useRouter();

  const handleFolderDelete = async (folder) => {
    setToastMessage("Folder deleted (Mock)");
    setToastMode("success");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFolderClick = (folder) => {
    router.push(`/folder/${folder.id}?name=${folder.name}`);
  };

  return (
    <>
      {showToast && <Toast message={toastMessage} mode={toastMode} />}
      <div className="p-5 mt-5 bg-white rounded-lg">
        <h2 className="text-[17px] font-bold">
          Recent Folders
          <span onClick={() => router.push("/folder/view-all")} className="hover:underline cursor-pointer float-right text-primary-400 font-normal text-sm">
            View All
          </span>
        </h2>

        {loading ? (
             <p>Loading...</p>
        ) : (
          <div>
            {folderList.length > 0 ? (
              <div className="grid grid-cols-2 mt-3 m-3 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {folderList
                  .slice(0, 10)
                  .map((folder) => (
                    <div key={folder.id}>
                      <FolderItem
                        folder={folder}
                        deleteFolder={() => handleFolderDelete(folder)}
                        handleFolderClick={handleFolderClick}
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center my-10 text-gray-500">
                No folders found
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FolderList;
