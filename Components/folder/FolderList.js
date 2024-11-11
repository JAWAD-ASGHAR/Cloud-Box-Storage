"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import FolderItem from "./FolderItem";
import Loading from "../Loading";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import app from "@/Config/FirebaseConfig";
import { FolderRefreshContext } from "@/Context/FolderRefreshContext";
import Toast from "../Toast";
import { supabase } from "@/Config/supabaseClient";
import { FileRefreshContext } from "@/Context/FileRefreshContext";

const FolderList = ({ folderList, loading }) => {
  const [activeFolderId, setActiveFolderId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const { folderRefresh, setFolderRefresh } = useContext(FolderRefreshContext);
  const { fileRefresh, setFileRefresh } = useContext(FileRefreshContext);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastMode, setToastMode] = useState("");
  const db = getFirestore(app);
  const router = useRouter();

  const handleFolderDelete = async (folder) => {
    try {
      console.log("Deleting folder:", folder);
      setDeleteLoading(folder.id);

      // Delete the current folder's files
      await deleteFilesInFolder(folder.id);

      // Recursively delete all subfolders and their contents
      await deleteSubfolders(folder.id);

      // Finally, delete the folder itself
      await deleteDoc(doc(db, "folders", folder.id.toString()));

      console.log("Folder deleted successfully!");
      setToastMessage("Folder deleted successfully!");
      setToastMode("success");
      setFolderRefresh(!folderRefresh);
      setFileRefresh(!fileRefresh);
    } catch (err) {
      console.log("Error deleting folder:", err);
      setToastMessage(`Error deleting folder: ${err.message}`);
      setToastMode("error");
    } finally {
      setTimeout(() => setShowToast(false), 3000);
      setDeleteLoading(null); // Reset loading state
    }
  };

  // Helper function to delete all files in a given folder
  const deleteFilesInFolder = async (folderId) => {
    console.log("Deleting files in folder:", folderId);

    const filesSnapshot = await getDocs(
      query(collection(db, "files"), where("parentFolderId", "==", folderId))
    );

    if (!filesSnapshot.empty) {
      const files = filesSnapshot.docs.map((doc) => ({
        id: doc.id,
        imageName: doc.data().imageName,
      }));

      for (const file of files) {
        console.log("Deleting file", file.id);
        await deleteDoc(doc(db, "files", file.id));
      }

      const fileNames = files.map((file) => file.imageName);
      const promises = fileNames.map((fileName) => {
        const { data, error } = supabase.storage
          .from("Cloud App Uploads")
          .remove(`public/${fileName}`, { returnResponse: true });

        console.log("Supabase response:", { data, error });
        return { data, error };
      });

      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        if (response.error) {
          console.log("Supabase error:", response.error);
          setToastMessage(`Supabase error: ${response.error.message}`);
          setToastMode("error");
          throw new Error(`Supabase error: ${response.error.message}`);
        }
      });
    } else {
      console.log("No files found in folder with id:", folderId);
    }
  };

  // Recursive function to delete all subfolders
  const deleteSubfolders = async (parentFolderId) => {
    console.log("Checking for subfolders in folder:", parentFolderId);

    const subfoldersSnapshot = await getDocs(
      query(
        collection(db, "folders"),
        where("parentFolderId", "==", parentFolderId)
      )
    );

    if (!subfoldersSnapshot.empty) {
      const subfolders = subfoldersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      for (const subfolder of subfolders) {
        console.log("Recursively deleting subfolder:", subfolder.id);
        // Recursively delete subfolder and its contents
        await handleFolderDelete(subfolder);
      }
    } else {
      console.log("No subfolders found in folder with id:", parentFolderId);
    }
  };

  const handleFolderClick = (folder) => {
    setActiveFolderId(folder.id);
    router.push(`/folder/${folder.id}?name=${folder.name}`);
  };

  return (
    <>
      {showToast && <Toast message={toastMessage} mode={toastMode} />}
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
            <Loading
              loading={loading}
              size="loading-md"
              className="w-full my-10"
            />
          </div>
        ) : (
          <div>
            {folderList.length > 0 ? (
              <div className="grid grid-cols-2 mt-3 m-3 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {folderList.map((folder) => (
                  <div key={folder.id}>
                    <FolderItem
                      folder={folder}
                      active={activeFolderId === folder.id}
                      deleteFolder={handleFolderDelete}
                      handleFolderClick={handleFolderClick}
                      loadingId={deleteLoading == folder.id}
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
    </>
  );
};

export default FolderList;
