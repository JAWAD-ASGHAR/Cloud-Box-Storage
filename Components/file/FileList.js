"use client";

import React, { useState } from "react";
import FileItem from "./FileItem";
import Toast from "../Toast";

function FileList({ fileList, loading }) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastMode, setToastMode] = useState("");

  const deleteFile = async (file) => {
    setToastMessage("File deleted (Mock)");
    setToastMode("success");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      {showToast && <Toast message={toastMessage} mode={toastMode} />}
      <div className="bg-white mt-5 p-5 rounded-lg">
        <h2 className="text-[18px] font-bold">Recent Files</h2>
        {loading ? (
             <p>Loading...</p>
        ) : (
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
                {fileList
                  .map((item) => (
                    <div key={item.id}>
                      <FileItem
                        file={item}
                        delete={() => deleteFile(item)}
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center my-10 text-gray-500">No files found</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default FileList;
