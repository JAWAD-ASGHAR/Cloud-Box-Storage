"use client";

import React from "react";
import { useRouter } from "next/navigation";
import FolderItem from "./FolderItem";
import Loading from "../Loading";

const FolderList = ({ folderList, loading }) => {
  const [activeFolderId, setActiveFolderId] = React.useState(null);
  const router = useRouter();

  const handleFolderClick = (folder) => {
    setActiveFolderId(folder.id);
    router.push(`/folder/${folder.id}?name=${folder.name}`);
  };

  return (
    <div className="p-5 mt-5 bg-white rounded-lg">
  <h2 className="text-[17px] font-bold">
    Recent Folders
    <span className="hover:underline cursor-pointer float-right text-primary-400 font-normal text-sm">
      View All
    </span>
  </h2>

  {/* Show loading indicator only when loading is true */}
  {loading ? (
    <div className="flex items-center justify-center mt-3 m-3">
      <Loading loading={loading} size="loading-md" className="w-full my-10" />
    </div>
  ) : (
    // Only show folder list or "No folders found" when not loading
    <div className="grid grid-cols-2 mt-3 m-3 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {folderList.length > 0 ? (
        folderList.map((folder) => (
          <div key={folder.id} onClick={() => handleFolderClick(folder)}>
            <FolderItem folder={folder} active={activeFolderId === folder.id} />
          </div>
        ))
      ) : (
        <p className="text-center my-5">No folders found</p>
      )}
    </div>
  )}
</div>

  );

};

export default FolderList;
