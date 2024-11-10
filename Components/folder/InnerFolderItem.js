import Image from "next/image";
import React from "react";

const InnerFolderItem = ({ folder, active }) => {

  return (
    <div
      className={`w-full flex items-center hover:shadow-sm ${
        active ? "bg-gray-50" : ""
      } hover:bg-gray-50 cursor-pointer p-3`}
    >
      <Image
        width={30}
        height={30}
        src="/folder.png"
        alt="folder icon"
        className="mr-4"
      />
      <h2 className="line-clamp-2 text-sm">{folder.name}</h2>
    </div>
  );
};

export default InnerFolderItem;
