"use client";

import app from "@/Config/FirebaseConfig";
import { FileRefreshContext } from "@/Context/FileRefreshContext";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import moment from "moment";
import Image from "next/image";
import react, { useContext, useState } from "react";
import Toast from "../Toast";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { supabase } from "@/Config/supabaseClient";

const iconsArray = ["doc", "jpg", "mp4", "pdf", "png", "pptx"];

function FileItem({ file, loadingId, delete: deleteFile }) {
  const image = "/" + file.type + ".png";
  const deleteLoading = loadingId === file.id;
  const [starLoading, setStarLoading] = useState(false);
  const { fileRefresh, setFileRefresh } = useContext(FileRefreshContext);
  const [toastMessage, setToastMessage] = useState("");
  const [toastMode, setToastMode] = useState("");
  const [activeToast, setActiveToast] = useState(false);

  const handleDownload = async (file) => {
    if (deleteLoading) {
      return;
    }
    
    if (!file.id) {
      setToastMessage("File ID is missing!");
      setToastMode("error");
      setActiveToast(true);
      setTimeout(() => setActiveToast(false), 3000);
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from("Cloud App Uploads")
        .download(`public/${file.imageName}`);

      if (error) {
        console.error("Supabase download error:", error);
        throw error;
      }
      
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      setToastMessage("Download started successfully!");
      setToastMode("success");
      setActiveToast(true);
      setTimeout(() => setActiveToast(false), 3000);
      
    } catch (error) {
      setToastMessage("An error occurred while downloading the file.");
      setToastMode("error");
      setActiveToast(true);
      setTimeout(() => setActiveToast(false), 3000);
    }
  };

  const toggleStar = async (file) => {
    if (deleteLoading) return;
    if (!file.id) {
      setToastMessage("File ID is missing!");
      setToastMode("error");
      setActiveToast(true);
      setTimeout(() => setActiveToast(false), 3000);
      return;
    }
    setStarLoading(true);
    const db = getFirestore(app);
    const fileRef = doc(db, "files", file.id);
    try {
      const fileSnapshot = await getDoc(fileRef);
      if (fileSnapshot.exists()) {
        await setDoc(
          fileRef,
          { isStarred: !fileSnapshot.data().isStarred },
          { merge: true }
        );
        setFileRefresh(!fileRefresh);
        setToastMessage("Star status toggled successfully!");
        setToastMode("success");
      } else {
        setToastMessage("File does not exist!");
        setToastMode("error");
      }
    } catch {
      setToastMessage("An error occurred while toggling star status.");
      setToastMode("error");
    }
    setActiveToast(true);
    setTimeout(() => setActiveToast(false), 3000);
    setStarLoading(false);
  };

  return (
    <>
      {activeToast && <Toast message={toastMessage} mode={toastMode} />}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 justify-between p-3 rounded-md 
        ${
          starLoading
            ? "bg-gray-200 cursor-not-allowed opacity-50"
            : "hover:bg-gray-100 cursor-pointer"
        }`}
      >
        <div className="flex gap-2 items-center">
          <Image
            src={iconsArray.includes(file.type) ? image : "/doc.png"}
            alt="file-icon"
            width={26}
            height={20}
          />
          <h2
            className={`text-[15px] truncate ${
              !deleteLoading && "hover:underline hover:text-primary-400"
            }`}
            onClick={() => !deleteLoading && window.open(file.imageUrl)}
          >
            {file.name}
          </h2>
        </div>
        <div className="grid grid-cols-3 items-center">
          <h2 className="text-[15px]">
            {moment(file.modifiedAt).format("DD MMMM")}
          </h2>
          <h2 className="text-[15px]">
            {(file.size / 1024 ** 2).toFixed(2)} MB
          </h2>
          <div className="flex gap-4 items-center justify-end">
            <svg
              onClick={() => toggleStar(file)}
              xmlns="http://www.w3.org/2000/svg"
              fill={file.isStarred ? "yellow" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-5 h-5 text-yellow-500 transition-all 
      ${
        !deleteLoading ? "hover:scale-110 cursor-pointer" : "cursor-not-allowed"
      }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
            <IoCloudDownloadOutline
              onClick={() => handleDownload(file)}
              className="w-5 h-5 text-gray-500 hover:scale-110 cursor-pointer transition-all"
            />
            <svg
              onClick={() => !deleteLoading && deleteFile(file)}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-5 h-5 text-red-500 transition-all 
      ${
        !deleteLoading ? "hover:scale-110 cursor-pointer" : "cursor-not-allowed"
      }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

export default FileItem;
