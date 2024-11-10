"use client";

import React, { use, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/Components/SearchBar";
import { ParentFolderIdContext } from "@/Context/ParentFolderIdContext";
import { app } from "@/Config/FirebaseConfig";
import { useSession } from "next-auth/react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import FolderItem from "@/Components/folder/FolderItem";
import Loading from "@/Components/Loading";
import { FolderRefreshContext } from "@/Context/FolderRefreshContext";
import InnerFolderList from "@/Components/folder/InnerFolderList";

const FolderDetails = ({ params }) => {
  const searchParams = useSearchParams();
  const unwrappedParams = use(params);  // Unwrap the params promise
  const folderId = unwrappedParams.id;
  const folderName = searchParams.get("name");
  const [folderList, setFolderList] = useState([]);
  const { data: session, status } = useSession();
  const [folderLoading, setFolderLoading] = useState(true);
  const [activeFolderId, setActiveFolderId] = useState(null);
  const { setParentFolderId } = useContext(ParentFolderIdContext);
  const { folderRefresh, setFolderRefresh } = useContext(FolderRefreshContext);
  const db = getFirestore(app);

  const router = useRouter();

  useEffect(() => {
    setFolderList([]);
    setParentFolderId(folderId);

    // Only fetch folders if authenticated
    if (status === "authenticated") {
      getFolderList();
    }
  }, [folderId, status, folderRefresh ]);

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

  const handleFolderClick = (folder) => {
    setActiveFolderId(folder.id);
    router.push(`/folder/${folder.id}?name=${folder.name}`);
  };

  return (
    <div className="p-5 h-screen bg-slate-100">
      <SearchBar />
      <h1 className="font-bold mt-5 m-3">{folderName}</h1>
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
            No available files or folders
          </p>
        )}
        {folderList.length > 0 && (
          <ul className="m-3">
            {folderList.map((folder) => (
              <li key={folder.id} onClick={() => handleFolderClick(folder)}>
                <InnerFolderList
                  folder={folder}
                  active={activeFolderId === folder.id}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

  );
};

export default FolderDetails;
