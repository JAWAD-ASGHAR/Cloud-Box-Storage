import React, { useState } from "react";
import Toast from "../Toast";

const CreateFolderModal = ({ isOpen, onClose }) => {
  const [folderName, setFolderName] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastMode, setToastMode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    if(isLoading) return
    setFolderName("");
    onClose();
  };

  const handleCreate = async () => {
    if (!folderName) {
      handleClose();
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
        setToastMessage("Folder created successfully! (Mock)");
        setToastMode("success");
        setShowToast(true);
        setIsLoading(false);
        setFolderName("");
        onClose();
        setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  return (
    <>
      {showToast && (
        <Toast message={toastMessage} mode={toastMode} />
      )}
      <div className={`modal backdrop-blur-md z-30 ${isOpen ? "modal-open" : ""}`} onClick={handleClose}>
        <div
          className="modal-box relative max-w-xs bg-white text-gray-800"
          onClick={(e) => e.stopPropagation()} // Prevents click outside from closing
        >
          <button
            className="btn btn-sm btn-circle absolute right-2 top-2 bg-white hover:bg-gray-100 border-none"
            onClick={handleClose}
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

