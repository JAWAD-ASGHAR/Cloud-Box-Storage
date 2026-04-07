"use client";

import React, { useState } from "react";
import FileItem from "@/Components/file/FileItem";
import SearchBar from "@/Components/SearchBar";
import { mockFiles } from "@/Data/mockData";

const Page = () => {
  // Only show first few files as starred for now
  const [fileList, setFileList] = useState(mockFiles.slice(0, 2));

  return (
    <div className="h-full bg-slate-100 p-5">
      <SearchBar />
      <div className="bg-white mt-5 p-5 rounded-lg">
        <h2 className="text-[18px] font-bold">Starred Files</h2>
        <div>
          {fileList.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 text-[13px] font-semibold border-b-[1px] pb-2 mt-3 border-gray-300 text-gray-400">
                <h2>Name</h2>
                <div className="grid grid-cols-3">
                  <h2>Modified</h2>
                  <h2>Size</h2>
                  <h2></h2>
                </div>
              </div>
              {fileList.map((item) => (
                <div key={item.id}>
                  <FileItem
                    file={item}
                    delete={() => {}}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center my-10 text-gray-500">
              No starred files found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
