import React from "react";
import { Loader } from "lucide-react"; // Import the Loader icon from lucide-react

function Modal({ isOpen, onClose, message, type }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="text-center">
          {type === "loading" && (
            <div className="flex justify-center">
              <Loader className="animate-spin h-12 w-12 text-indigo-600" />
            </div>
          )}
          {type === "error" && <p className="text-red-500">{message}</p>}
          {type === "success" && <p className="text-green-500">{message}</p>}
        </div>
        <div className="mt-4 flex justify-center">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
