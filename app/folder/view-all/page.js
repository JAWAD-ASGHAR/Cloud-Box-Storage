"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import app from "@/Config/FirebaseConfig";
import { useSession } from "next-auth/react";
import Loading from "@/Components/Loading";
import Toast from "@/Components/Toast";
import { useRouter } from "next/navigation";
import SearchBar from "@/Components/SearchBar";
import { ParentFolderIdContext } from "@/Context/ParentFolderIdContext";
import FolderItem from "@/Components/folder/FolderItem";
import { FolderRefreshContext } from "@/Context/FolderRefreshContext";
import Modal from "@/Components/Modal";
import { FileRefreshContext } from "@/Context/FileRefreshContext";

const Page = () => {
  const db = getFirestore(app);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastMode, setToastMode] = useState("");
  const { setParentFolderId } = useContext(ParentFolderIdContext);
  const {folderRefresh, setFolderRefresh} = useContext(FolderRefreshContext);
  const {fileRefresh, setFileRefresh} = useContext(FileRefreshContext);
  const [activeFolderId, setActiveFolderId] = useState(null);
  const [folderLoading, setFolderLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [folderList, setFolderList] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      getFolderList();
    }
    setParentFolderId(0);
  }, [status, folderRefresh ]);

  const handleFolderDelete = async (folder) => {
    setShowModal(true);

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
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setShowModal(false);
      setDeleteLoading(null); // Reset loading state
    }
  };

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

  const getFolderList = async () => {
    setFolderLoading(true);
    try {
      const q = query(
        collection(db, "folders"),
        where("createdBy", "==", session.user.email),
        where("parentFolderId", "==", 0)
      );
      const querySnapshot = await getDocs(q);
      const folders = querySnapshot.docs.map((doc) => doc.data());
      setFolderList(folders);
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setFolderLoading(false);
    }
  };

  return (
    <>
      {showToast && <Toast message={toastMessage} mode={toastMode} />}
      <Modal
        isOpen={showModal}
        loading={deleteLoading}
        onConfirm={() => handleFolderDelete(selectedFolder)}
        mode={"delete"}
        onCancel={() => setShowModal(false)}
      />
      <div className="h-full bg-slate-100 p-5">
        <SearchBar />
        <div className="bg-white mt-5 p-5 rounded-lg">
          <h2 className="text-[18px] font-bold">View Folders</h2>
          {folderLoading ? (
            <div className="flex items-center justify-center mt-3 m-3">
              <Loading
                loading={folderLoading}
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
                        deleteFolder={() => handleDeleteRequest(folder)}
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
      </div>
    </>
  );
};

export default Page;
