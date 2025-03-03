import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null; 

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick} 
    >
      <div className="bg-gray-800 p-6 rounded shadow-lg w-80 md:w-96 lg:w-1/2 max-w-lg">
        <Button 
          onClick={onClose} 
          variant="secondary"
          className="absolute top-2 right-2 text-gray-300 hover:text-white p-1"
        >
          &times;
        </Button>
        {children}
      </div>
    </div>,
    document.body 
  );
};

export default Modal; 