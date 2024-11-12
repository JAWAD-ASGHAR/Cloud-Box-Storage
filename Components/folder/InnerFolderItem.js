import Image from "next/image";
import React from "react";
import { FaTrash } from "react-icons/fa";

const InnerFolderItem = ({ folder, active, onDelete, loadingId, handleClick, modalOpen }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (!modalOpen) {
      onDelete(folder);
    }
  };

  return (
    <div
      className={`w-full flex items-center justify-between hover:shadow-sm ${
        active ? "bg-gray-50" : ""
      } hover:bg-gray-50 cursor-pointer p-3 ${
        loadingId || modalOpen ? "cursor-not-allowed opacity-50 pointer-events-none" : ""
      }`}
      onClick={() => !modalOpen && handleClick(folder)}
    >
      <div className="w-full flex items-center">
        <Image
          width={30}
          height={30}
          src="/folder.png"
          alt="folder icon"
          className="mr-4"
        />
        <h2 className="line-clamp-2 text-sm">{folder.name}</h2>
      </div>
      <button
        className="p-2 z-10 rounded text-red-400 hover:text-red-500 transition-all"
        onClick={(e) => handleDelete(e)}
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default InnerFolderItem;

