import React from "react";

const Toast = ({message, mode}) => {
  let className;
  if (mode === "success") {
    className = "alert-success";
  } else if (mode === "error") {
    className = "alert-error";
  } else {
    className = "";
  }


  return (
    <div className="toast toast-top toast-end">
      <div className={`alert ${className}`}>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;

