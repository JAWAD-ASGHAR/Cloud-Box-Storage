"use client";

import React, { useContext, useEffect, useState } from "react";
import { supabase } from "@/Config/supabaseClient";
import { FileRefreshContext } from "@/Context/FileRefreshContext";
import {
  deleteDoc,
  doc,
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import app from "@/Config/FirebaseConfig";
import FileItem from "@/Components/file/FileItem";
import { useSession } from "next-auth/react";
import Loading from "@/Components/Loading";
import Toast from "@/Components/Toast";
import { useRouter } from "next/navigation";
import SearchBar from "@/Components/SearchBar";
import { ParentFolderIdContext } from "@/Context/ParentFolderIdContext";

const Page = () => {
  const db = getFirestore(app);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [fileList, setFileList] = useState([]);
  const [fileLoading, setFileLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { fileRefresh } = useContext(FileRefreshContext);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastMode, setToastMode] = useState("");
  const { setParentFolderId } = useContext(ParentFolderIdContext);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      getFileList();
    }
    setParentFolderId(0);
  }, [status, fileRefresh]);

  const getFileList = async () => {
    console.log("[DEBUG] Getting file list...");
    setFileLoading(true);
    try {
      const q = query(
        collection(db, "files"),
        where("createdBy", "==", session.user.email)
      );
      const querySnapshot = await getDocs(q);
      console.log(
        "[DEBUG] Fetched files:",
        querySnapshot.docs.map((doc) => doc.data())
      );
      const files = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFileList(files);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      console.log("[DEBUG] Finished getting file list.");
      setFileLoading(false);
    }
  };

  const deleteFile = async (file) => {
    try {
      setDeleteLoading(file.id);

      // Delete the document from Firestore
      await deleteDoc(doc(db, "files", file.id.toString()));

      // Delete the file from Supabase storage
      const { error } = await supabase.storage
        .from("Cloud App Uploads")
        .remove([`public/${file.imageName}`]);

      if (error) {
        setDeleteLoading(null);
        throw new Error(`Supabase error: ${error.message}`);
      }

      // Remove the file from the displayed list without refreshing
      setFileList((prevList) => prevList.filter((f) => f.id !== file.id));

      setToastMessage("File deleted successfully!");
      setToastMode("success");
    } catch (err) {
      setToastMessage(`Error deleting file: ${err.message}`);
      setToastMode("error");
    } finally {
      setDeleteLoading(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <>
      {showToast && <Toast message={toastMessage} mode={toastMode} />}
      <div className="h-full bg-slate-100 p-5">
        <SearchBar />
        <div className="bg-white mt-5 p-5 rounded-lg">
          <h2 className="text-[18px] font-bold">My Files</h2>
          {fileLoading ? (
            <div className="flex items-center justify-center mt-3 m-3">
              <Loading
                loading={fileLoading}
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
                  {fileList
                    .sort(
                      (a, b) =>
                        b.createdDate.toDate().getTime() -
                        a.createdDate.toDate().getTime()
                    )
                    .map((item) => (
                      <div key={item.id}>
                        <FileItem
                          file={item}
                          loadingId={deleteLoading}
                          delete={deleteFile}
                        />
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center my-10 text-gray-500">
                  No files found
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
