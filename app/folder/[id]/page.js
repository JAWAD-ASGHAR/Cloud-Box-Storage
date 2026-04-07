"use client";

import React, { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/Components/SearchBar";
import InnerFolderList from "@/Components/folder/InnerFolderList";
import FileList from "@/Components/file/FileList";
import { mockFolders, mockFiles } from "@/Data/mockData";

const FolderDetails = ({ params }) => {
  const searchParams = useSearchParams();
  const unwrappedParams = use(params);
  const folderId = unwrappedParams.id;
  const folderName = searchParams.get("name");

  const [folderList, setFolderList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [folderLoading, setFolderLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    // Filter mock data by folderId
    const filteredFolders = mockFolders.filter(f => String(f.parentFolderId) === String(folderId));
    const filteredFiles = mockFiles.filter(f => String(f.parentFolderId) === String(folderId));

    setFolderList(filteredFolders);
    setFileList(filteredFiles);
  }, [folderId]);

  return (
    <div className="p-5 h-full bg-slate-100">
      <SearchBar />
      <h1 className="font-bold text-[20px] mt-5 m-3">{folderName}</h1>
      <InnerFolderList folderList={folderList} folderLoading={folderLoading} />
      <FileList fileList={fileList} loading={fileLoading} />
    </div>
  );
};

export default FolderDetails;