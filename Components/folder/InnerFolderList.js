import React, { useState } from "react";
import InnerFolderItem from "./InnerFolderItem";
import Loading from "../Loading";
import { useRouter } from "next/navigation";

const InnerFolderList = ({ folderList, folderLoading }) => {
  const router = useRouter();

  const [activeFolderId, setActiveFolderId] = useState(null);

  const handleFolderClick = (folder) => {
    setActiveFolderId(folder.id);
    router.push(`/folder/${folder.id}?name=${folder.name}`);
  };

  return (
    <div className="p-5 mt-5 bg-white rounded-lg">
      <div className="flex items-center justify-center">
        <Loading
          loading={folderLoading}
          size="loading-md"
          className="w-full my-10"
        />
      </div>
      {!folderList.length && !folderLoading && (
        <p className="text-center my-10 text-gray-500">No available folders</p>
      )}
      {folderList.length > 0 && (
        <ul className="m-3">
          {folderList.map((folder) => (
            <li key={folder.id} onClick={() => handleFolderClick(folder)}>
              <InnerFolderItem
                folder={folder}
                active={activeFolderId === folder.id}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InnerFolderList;
