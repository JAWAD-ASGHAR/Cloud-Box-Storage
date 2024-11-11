"use client";

import React, { use, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/Components/SearchBar";
import { ParentFolderIdContext } from "@/Context/ParentFolderIdContext";
import app from "@/Config/FirebaseConfig";
import { useSession } from "next-auth/react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { FolderRefreshContext } from "@/Context/FolderRefreshContext";
import InnerFolderList from "@/Components/folder/InnerFolderList";
import { FileRefreshContext } from "@/Context/FileRefreshContext";
import FileList from "@/Components/file/FileList";

const FolderDetails = ({ params }) => {
  const searchParams = useSearchParams();
  const unwrappedParams = use(params);
  const folderId = unwrappedParams.id;
  const folderName = searchParams.get("name");
  const [folderList, setFolderList] = useState([]);
  const { data: session, status } = useSession();
  const [folderLoading, setFolderLoading] = useState(true);
  const { setParentFolderId } = useContext(ParentFolderIdContext);
  const { folderRefresh, setFolderRefresh } = useContext(FolderRefreshContext);
  const [fileLoading, setFileLoading] = useState(true);
  const { fileRefresh, setFileRefresh } = useContext(FileRefreshContext);
  const [fileList, setFileList] = useState([]);
  const db = getFirestore(app);


  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }

    setParentFolderId(folderId);
  }, [folderId, setParentFolderId, session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }

    if (status === "authenticated") {
      setFolderList([]);
      getFolderList();
    }
  }, [folderId, folderRefresh, session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }

    if (status === "authenticated") {
      setFileList([]);
      getFileList();
    }
  }, [folderId, fileRefresh, session]);

  const getFolderList = async () => {
    setFolderLoading(true);
    try {
      if (!session?.user?.email) {
        console.error("User email not found in session");
        return;
      }

      const q = query(
        collection(db, "folders"),
        where("createdBy", "==", session.user.email),
        where("parentFolderId", "==", folderId)
      );

      const querySnapshot = await getDocs(q);
      const folders = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Add id manually
        ...doc.data(),
      }));
      setFolderList(folders);
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setFolderLoading(false);
    }
  };

  const getFileList = async () => {
    setFileLoading(true);
    try {
      const q = query(
        collection(db, "files"),
        where("createdBy", "==", session.user.email),
        where("parentFolderId", "==", folderId)
      );
      const querySnapshot = await getDocs(q);
      const files = querySnapshot.docs.map((doc) => doc.data());
      setFileList(files);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setFileLoading(false);
    }
  };

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
