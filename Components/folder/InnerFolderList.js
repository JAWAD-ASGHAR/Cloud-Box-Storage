"use client";

import React, { useState } from "react";
import Toast from "../Toast";
import InnerFolderItem from "./InnerFolderItem";
import { useRouter } from "next/navigation";

const InnerFolderList = ({ folderList, folderLoading }) => {
  const router = useRouter();
  const [activeFolderId, setActiveFolderId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastMode, setToastMode] = useState("");

  const handleFolderDelete = async (folder) => {
    setToastMessage("Folder deleted (Mock)");
    setToastMode("success");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFolderClick = (folder) => {
    setActiveFolderId(folder.id);
    router.push(`/folder/${folder.id}?name=${folder.name}`);
  };

  return (
    <>
      {showToast && (
        <Toast
          message={toastMessage}
          mode={toastMode}
        />
      )}
      <div className="p-5 mt-5 bg-white rounded-lg">
        {!folderList.length && !folderLoading && (
          <p className="text-center my-10 text-gray-500">
            No available folders
          </p>
        )}
        {folderList.length > 0 && (
          <ul className="m-3">
            {folderList.map((folder) => (
                <li key={folder.id}>
                  <InnerFolderItem
                    folder={folder}
                    active={activeFolderId === folder.id}
                    onDelete={() => handleFolderDelete(folder)}
                    handleClick={handleFolderClick}
                  />
                </li>
              ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default InnerFolderList;
