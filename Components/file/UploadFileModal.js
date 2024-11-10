import { app } from "@/Config/FirebaseConfig";
import { ParentFolderIdContext } from "@/Context/ParentFolderIdContext";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useContext, useState } from "react";
import Toast from "../Toast";

const UploadFileModal = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastMode, setToastMode] = useState("");
  const { parentFolderId, setParentFolderId } = useContext(
    ParentFolderIdContext
  );
  const db = getFirestore(app);
  const docId = Date.now().toString();

  const handleFileUpload = async (e) => {
    try {
      onClose();

      const file = e.target.files[0];
      if (!file) return;

      // 1. Upload file to Supabase using the API route
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      // Check if the response is successful
      if (res.ok) {
        const data = await res.json();
        console.log("Uploaded file URL:", data.url); // This should display the public URL
        if (data.url) {
          console.log("File uploaded successfully. Public URL:", data.url);
        } else {
          console.error("Failed to retrieve the public URL");
        }
      } else {
        const error = await res.json();
        console.error("Upload error:", error.error);
      }
      
      

      // 2. Save file metadata to Firestore
      await setDoc(doc(db, "files", docId), {
        name: file.name,
        type: file.name.split(".").pop(),
        size: file.size,
        modifiedAt: file.lastModified,
        id: docId,
        createdBy: session.user.email,
        createdDate: new Date(),
        parentFolderId,
        imageUrl: "/folder.png",
      });

      // 3. Show success message using toast
      setToastMessage("File uploaded successfully!");
      setToastMode("success");
    } catch (error) {
      // Handle any errors in upload or Firestore save
      console.error("Error uploading file:", error);
      setToastMessage("Error uploading file!");
      setToastMode("error");
    } finally {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); // Show toast for 3 seconds
    }
  };

  return (
    <>
      {showToast && <Toast message={toastMessage} mode={toastMode} />}
      <div className={`modal ${isOpen ? "modal-open" : ""}`} onClick={onClose}>
        <div
          className="modal-box p-9 bg-white items-center w-[360px] relative"
          onClick={(e) => e.stopPropagation()} // Prevents click outside from closing
        >
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
          <div className="w-full items-center flex flex-col justify-center gap-3">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadFileModal;
