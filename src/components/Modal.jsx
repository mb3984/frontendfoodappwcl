import React, { useEffect } from "react";
import "./Modal.css";

const Modal = ({ children, onClose }) => {
  // Close modal when "Escape" key is pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <>
      {/* Background overlay (backdrop) */}
      <div className="backdrop" onClick={onClose}></div>

      {/* The modal dialog */}
      <dialog className="modal" open aria-modal="true" role="dialog">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        {children} {/* Allows passing any content inside the modal */}
      </dialog>

      {/* Inline CSS for better styling */}
      <style>
        {`
          .backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }

          .modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 1000;
          }

          .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
          }

          .close-btn:hover {
            color: red;
          }
        `}
      </style>
    </>
  );
};

export default Modal;
