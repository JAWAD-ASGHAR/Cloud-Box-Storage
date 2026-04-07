"use client";

import { useEffect, useState } from "react";
import SearchBar from "../Components/SearchBar";
import FolderList from "../Components/folder/FolderList";
import FileList from "../Components/file/FileList";
import { mockFolders, mockFiles } from "@/Data/mockData";

export default function Home() {
  const [folderLoading, setFolderLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileList, setFileList] = useState(mockFiles.filter(file => file.parentFolderId === 0));
  const [folderList, setFolderList] = useState(mockFolders.filter(folder => folder.parentFolderId === 0));

  return (
    <div className="h-full bg-slate-100 p-5">
      <SearchBar />
      <FolderList folderList={folderList} loading={folderLoading} />
      <FileList fileList={fileList} loading={fileLoading} />
    </div>
  );
}
