import React from "react";

export default function Modal({ isOpen, onClose, imageSrc }) {
  if (!isOpen) return null;

  const handleClickOutside = (e) => {
    // Schließt das Modal nur, wenn der Klick auf den Hintergrund und nicht auf das Bild erfolgt
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" 
    onClick={handleClickOutside}>
      <div className="relative max-w-4xl">
        <button
          className="absolute top-4 right-4 text-gray-500 text-4xl font-bold hover:text-red-500 transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <img
          src={imageSrc}
          alt="Vergrößertes Bild"
          className="rounded-lg shadow-lg max-h-[80vh] object-contain"
        />
      </div>
    </div>
  );
}
