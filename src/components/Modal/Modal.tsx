import React, { useEffect, useRef } from "react";
import "./Modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: IconDefinition;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClick={handleBackdropClick}
      onCancel={onClose}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            {icon && (
              <FontAwesomeIcon icon={icon} className="modal-title-icon" />
            )}
            {title}
          </h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </dialog>
  );
};
