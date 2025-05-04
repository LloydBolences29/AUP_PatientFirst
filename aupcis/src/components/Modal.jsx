import React from "react";
import './Modal.css'
import { useEffect, useRef } from "react";

export const Modal = ({ show, onClose, title, body }) => {
    const modalRef = useRef(null); // Reference to the modal container

    // Close modal when clicking outside
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
       return show = false;
      }
    };
  
    // Close modal on ESC key press
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          return show = false;
        }
      };
  
      if (show) {
        document.body.classList.add("no-scroll"); // Disable background scroll
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.body.classList.remove("no-scroll"); // Enable background scroll
      }
  
      return () => {
        document.body.classList.remove("no-scroll"); // Cleanup
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [show]);
  


 
  if(!show) return null;
  


  return (
    <>
      <div
        className="modal show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-container">
          <div className="modal-wrapper">
            <div className="modal-content">
              <div className="modal-title">
                <div className="modal-title-content">{title}</div>
              </div>
              <div className="modal-body">
                <div className="modal-body-content">{body}</div>
              </div>
            </div>

            {/* <div className="btn-container">
              <button type="btn" className="btn btn-dark" onClick={onClose}>
                Close
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
