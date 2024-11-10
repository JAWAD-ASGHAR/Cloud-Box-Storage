import React from 'react';

const Loading = ({ loading, children, size = 'loading-lg', className }) => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      {loading ? (
        <div className="flex flex-col items-center space-y-2">
          <span className={`loading loading-spinner${className} ${size} text-primary-500`}></span>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default Loading;

