import { ParentFolderIdContext } from "@/Context/ParentFolderIdContext";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useContext, useState } from "react";
import Toast from "../Toast";
import { app } from "@/Config/FirebaseConfig";
import { FileRefreshContext } from "@/Context/FileRefreshContext";

const UploadFileModal = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastMode, setToastMode] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { parentFolderId } = useContext(ParentFolderIdContext);
  const { fileRefresh, setFileRefresh } = useContext(FileRefreshContext);
  const db = getFirestore(app);
  const docId = Date.now().toString();

  const handleFileSelect = (e) => {
    setSelectedFile(null);
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const closeModal = () => {
    setSelectedFile(null);
    onClose();
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("fileName", selectedFile.name);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        setToastMessage(`Upload error: ${error.error}`);
        setToastMode("error");
        setShowToast(true);
        return;
      }

      const data = await res.json();

      await setDoc(doc(db, "files", docId), {
        name: selectedFile.name,
        type: selectedFile.name.split(".").pop(),
        size: selectedFile.size,
        modifiedAt: selectedFile.lastModified,
        id: docId,
        createdBy: session.user.email,
        createdDate: new Date(),
        parentFolderId,
        imageUrl: data.url,
        imageName: data.name,
      });

      setFileRefresh(!fileRefresh);
      setToastMessage("File uploaded and saved successfully!");
      setToastMode("success");
      closeModal();
    } catch (error) {
      setToastMessage("Unexpected error occurred while uploading file!");
      setToastMode("error");
    } finally {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setIsUploading(false);
      setSelectedFile(null); // Reset selected file after upload
    }
  };

  return (
    <>
      {showToast && <Toast message={toastMessage} mode={toastMode} />}
      <div className={`modal ${isOpen ? "modal-open" : ""}`} onClick={closeModal}>
        <div
          className="modal-box p-9 bg-white items-center w-[360px] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={closeModal}
          >
            ✕
          </button>
          <div className="w-full items-center flex flex-col justify-center gap-3">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {!selectedFile ? (
                    <>
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
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </>
                  ) : (
                      <div className="flex flex-col items-center space-y-2 mt-2">
                        <p className="font-semibold text-gray-700">
                          {selectedFile.name}
                        </p>
                        <p
                          className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded transition duration-150"
                        >
                          Remove
                        </p>
                      </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                  />
                </div>
              </label>
            </div>
            <button
              onClick={!selectedFile || isUploading ? null : handleFileUpload}
              className={` ${
                !selectedFile || isUploading ? "cursor-not-allowed	" : ""
              } btn text-white border-none bg-primary-500 hover:bg-primary-400 mt-4 w-full`}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadFileModal;


