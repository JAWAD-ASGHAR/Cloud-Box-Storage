"use client";

import React, { useContext, useState } from "react";
import Loading from "../Loading";
import {
  collection,
  deleteDoc,
  doc,
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
import InnerFolderItem from "./InnerFolderItem";
import { useRouter } from "next/navigation";
import Modal from "../Modal";

const InnerFolderList = ({ folderList, folderLoading }) => {
  const router = useRouter();
  const [activeFolderId, setActiveFolderId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const { folderRefresh, setFolderRefresh } = useContext(FolderRefreshContext);
  const { fileRefresh, setFileRefresh } = useContext(FileRefreshContext);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toastMode, setToastMode] = useState("");
  const db = getFirestore(app);

  const handleFolderDelete = async (folder) => {
    try {
      setShowModal(true);
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
      setShowModal(false); // Reset modal state
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

  const handleDeleteRequest = (folder) => {
    setSelectedFolder(folder);
    setShowModal(true);
  };

  return (
    <>
      {showToast && (
        <Toast
          message={toastMessage}
          mode={toastMode}
          setShowToast={setShowToast}
        />
      )}
      <Modal
        isOpen={showModal}
        loading={deleteLoading}
        onConfirm={() => handleFolderDelete(selectedFolder)}
        mode={"delete"}
        onCancel={() => setShowModal(false)}
      />
      <div className="p-5 mt-5 bg-white rounded-lg">
        <div className="flex items-center justify-center">
          <Loading
            loading={folderLoading}
            size="loading-md"
            className="w-full my-10"
          />
        </div>
        {!folderList.length && !folderLoading && (
          <p className="text-center my-10 text-gray-500">
            No available folders
          </p>
        )}
        {folderList.length > 0 && (
          <ul className="m-3">
            {folderList
              .sort(
                (a, b) =>
                  b.createdDate.toDate().getTime() -
                  a.createdDate.toDate().getTime()
              )
              .map((folder) => (
                <li key={folder.id}>
                  <InnerFolderItem
                    folder={folder}
                    modalOpen={showModal}
                    loadingId={deleteLoading === folder.id}
                    active={activeFolderId === folder.id}
                    onDelete={handleDeleteRequest}
                    handleClick={handleFolderClick}
                  />
                </li>
              ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default InnerFolderList;
