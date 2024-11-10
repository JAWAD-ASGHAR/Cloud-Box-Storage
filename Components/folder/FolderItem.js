import Image from 'next/image';
import React from 'react';

const FolderItem = ({ folder, active }) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center h-[130px] hover:shadow-sm ${active ? 'bg-gray-50' : ''} hover:bg-gray-50 cursor-pointer rounded-lg border p-5`}>
        <Image width={40} height={40} src="/folder.png" alt="folder icon" />
        <h2 className='line-clamp-2 text-sm text-center'>{folder.name}</h2>
    </div>
  );
};

export default FolderItem;
