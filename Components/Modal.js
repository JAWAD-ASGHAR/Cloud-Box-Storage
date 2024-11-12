const Modal = ({ isOpen, mode, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;

  const handleCancel = () => {
    if (loading) return;
    onCancel();
  };
  const message =
    mode === "delete"
      ? "Are you sure you want to delete?"
      : "Are you sure you want to cancel?";
  const color =
    mode === "delete"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-primary-500 hover:bg-primary-600";

  return (
    <div
      className={`modal backdrop-blur-md z-30 ${
        isOpen ? "modal-open" : ""
      } flex items-center justify-center`}
       onClick={handleCancel}
    >
      <div
        className="modal-box p-8 bg-white w-[400px] max-w-full rounded-lg shadow-lg relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-500"
          onClick={handleCancel}
        >
          ✕
        </button>
        <p className="text-center mb-6 text-gray-700 font-medium">{message}</p>
        <div className="flex gap-3 w-full">
          <button
            onClick={handleCancel}
            className="btn bg-gray-300 text-gray-600 transition-all ease-in-out duration-300 border-none hover:bg-gray-400 w-1/2 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${color} transition-all ease-in-out duration-300 border-none text-white w-1/2 py-2 rounded-md`}
          >
            {loading ? "Loading" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

