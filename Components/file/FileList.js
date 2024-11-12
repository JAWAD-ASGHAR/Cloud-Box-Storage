"use client";

import React, { useContext, useState } from "react";
import FileItem from "./FileItem";
import Loading from "../Loading";
import { supabase } from "@/Config/supabaseClient";
import { FileRefreshContext } from "@/Context/FileRefreshContext";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import app from "@/Config/FirebaseConfig";
import Toast from "../Toast";
import Modal from "../Modal";

function FileList({ fileList, loading }) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastMode, setToastMode] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { fileRefresh, setFileRefresh } = useContext(FileRefreshContext);
  const db = getFirestore(app);

  const deleteFile = async (file) => {
    try {
      setDeleteLoading(file.id);

      // Delete from Firestore
      await deleteDoc(doc(db, "files", file.id.toString()));

      // Delete from Supabase storage
      const { error } = await supabase.storage
        .from("Cloud App Uploads")
        .remove([`public/${file.imageName}`]);

      if (error) {
        setDeleteLoading(null);
        throw new Error(`Supabase error: ${error.message}`);
      }

      setToastMessage("File deleted successfully!");
      setToastMode("success");
      setFileRefresh(!fileRefresh);
    } catch (err) {
      setToastMessage(`Error deleting file: ${err.message}`);
      setToastMode("error");
    } finally {
      setDeleteLoading(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setShowModal(false);
    }
  };

  const handleDeleteRequest = (file) => {
    setSelectedFile(file);
    setShowModal(true);
  };

  return (
    <>
      {showToast && <Toast message={toastMessage} mode={toastMode} />}
        <Modal
          isOpen={showModal}
          loading={deleteLoading}
          onConfirm={() => deleteFile(selectedFile)}
          mode={"delete"}
          onCancel={() => setShowModal(false)}
        />
      <div className="bg-white mt-5 p-5 rounded-lg">
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
                      loadingId={deleteLoading}
                      delete={() => handleDeleteRequest(item)}
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
