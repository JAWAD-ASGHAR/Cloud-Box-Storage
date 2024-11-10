import app from "@/Config/FirebaseConfig";
import React, { useContext, useState } from "react";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import Toast from "../Toast";
import { ParentFolderIdContext } from "@/Context/ParentFolderIdContext";
import { FolderRefreshContext } from "@/Context/FolderRefreshContext";

const CreateFolderModal = ({ isOpen, onClose }) => {
  const [folderName, setFolderName] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastMode, setToastMode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { parentFolderId, setParentFolderId } = useContext(
    ParentFolderIdContext
  );
  const docId = Date.now().toString();
  const { data: session } = useSession();
  const { folderRefresh, setFolderRefresh } = useContext(FolderRefreshContext);

  const handleCreate = async () => {
    if (!folderName) {
      onClose();
      return;
    }
    setIsLoading(true);
    await setDoc(doc(db, "folders", docId), {
      name: folderName,
      id: docId,
      createdBy: session.user.email,
      createdDate: new Date(),
      parentFolderId: parentFolderId,
    })
      .then(() => {
        setToastMessage("Folder created successfully!");
        setToastMode("success");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      })
      .catch((error) => {
        setToastMessage("Error creating Folder!");
        setToastMode("error");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      })
      .finally(() => {
        setIsLoading(false);
        setFolderRefresh(!folderRefresh);
        setFolderName("");
        onClose();
      });
  };

  const db = getFirestore(app);

  return (
    <>
      {showToast && (
        <Toast message="Folder created successfully!" mode={toastMode} />
      )}
      <div className={`modal ${isOpen ? "modal-open" : ""}`} onClick={onClose}>
        <div
          className="modal-box relative max-w-xs bg-white text-gray-800"
          onClick={(e) => e.stopPropagation()} // Prevents click outside from closing
        >
          <button
            className="btn btn-sm btn-circle absolute right-2 top-2 bg-white hover:bg-gray-100 border-none"
            onClick={onClose}
          >
            ✕
          </button>
          <div className="flex justify-center mb-4">
            <img src="/folder.png" alt="Folder Icon" className="w-12 h-12" />
          </div>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Folder Name"
            className="input input-bordered w-full mb-4 bg-white text-gray-800"
            ref={(input) => input && isOpen && input.focus()}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <button
            onClick={isLoading ? undefined : handleCreate}
            className={` ${
              isLoading ? "cursor-not-allowed	" : ""
            } btn text-white border-none bg-primary-500 hover:bg-primary-400 mt-4 w-full`}
          >
            {isLoading ? "Loading..." : "Create"}
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateFolderModal;

