import React, { useContext } from "react";
import FileItem from "./FileItem";
import Loading from "../Loading";

function FileList({ fileList, loading }) {
  return (
    <div
      className="bg-white mt-5 p-5
              rounded-lg"
    >
      <h2 className="text-[18px] font-bold">Recent Files</h2>
      {loading ? (
        <div className="flex items-center justify-center mt-3 m-3">
          <Loading
            loading={loading}
            size="loading-md"
            className="w-full my-10"
          />
        </div>
      ) : (
        <div>
          {fileList.length > 0 ? (
            <div>
              <div
                className="grid grid-cols-1
                  md:grid-cols-2 
                  text-[13px] 
                  font-semibold
                  border-b-[1px]
                  pb-2 mt-3
                  border-gray-300
                   text-gray-400"
              >
                <h2>Name</h2>
                <div className="grid grid-cols-3">
                  <h2>Modified</h2>
                  <h2>Size</h2>
                  <h2></h2>
                </div>
              </div>
              {fileList.map((item, index) => (
                <div key={index}>
                  <FileItem file={item} key={index} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center my-10 text-gray-500">No files found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default FileList;
