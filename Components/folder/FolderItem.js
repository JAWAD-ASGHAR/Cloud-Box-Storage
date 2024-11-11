import Image from "next/image";
import React from "react";
import { FaTrash } from "react-icons/fa";

const FolderItem = ({
  folder,
  active,
  deleteFolder,
  handleFolderClick,
  loadingId,
}) => {
  const [hovered, setHovered] = React.useState(null);
  const handleDelete = (e) => {
    e.stopPropagation();
    deleteFolder(folder);
  };

  return (
    <div
      onMouseEnter={() => setHovered(folder.id)}
      onMouseLeave={() => setHovered(null)}
      className={`w-full flex flex-col items-center justify-center h-[130px] hover:shadow-sm ${
        active ? "bg-gray-50" : ""
      } hover:bg-gray-50 cursor-pointer rounded-lg border p-5 relative ${
        loadingId ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={() => handleFolderClick(folder)}
    >
      <Image width={40} height={40} src="/folder.png" alt="folder icon" />
      <h2 className="line-clamp-2 text-sm text-center">{folder.name}</h2>
      {hovered === folder.id && (
        <button
          className="absolute top-0 right-0 p-2 z-10 rounded text-red-400 hover:text-red-500 transition-all"
          onClick={(e) => handleDelete(e)}
        >
          <FaTrash />
        </button>
      )}
    </div>
  );
};

export default FolderItem;
