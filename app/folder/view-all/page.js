"use client";

import React, { useState } from "react";
import SearchBar from "@/Components/SearchBar";
import FolderItem from "@/Components/folder/FolderItem";
import { mockFolders } from "@/Data/mockData";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [folderList, setFolderList] = useState(mockFolders.filter(f => f.parentFolderId === 0));
  const [folderLoading, setFolderLoading] = useState(false);

  const handleFolderClick = (folder) => {
    router.push(`/folder/${folder.id}?name=${folder.name}`);
  };

  const handleDeleteRequest = (folder) => {
    setFolderList(prev => prev.filter(f => f.id !== folder.id));
  };

  return (
    <div className="h-full bg-slate-100 p-5">
      <SearchBar />
      <div className="bg-white mt-5 p-5 rounded-lg">
        <h2 className="text-[18px] font-bold">View Folders</h2>
        {folderLoading ? (
           <p>Loading...</p>
        ) : (
          <div>
            {folderList.length > 0 ? (
              <div className="grid grid-cols-2 mt-3 m-3 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {folderList.map((folder) => (
                  <div key={folder.id}>
                    <FolderItem
                      folder={folder}
                      deleteFolder={() => handleDeleteRequest(folder)}
                      handleFolderClick={() => handleFolderClick(folder)}
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
    </div>
  );
};

export default Page;
