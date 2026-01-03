import React, { useEffect } from "react";
import { LuX } from "react-icons/lu";

const Modal = ({ children, isOpen, onClose, title, footer }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center w-full h-full animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      <div
        className="relative w-full max-w-2xl mx-4 mb-0 sm:mb-4 animate-slide-up rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden max-h-[85vh] sm:max-h-[calc(100vh-4rem)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            {title}
          </h3>

          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl text-sm w-9 h-9 inline-flex justify-center items-center cursor-pointer transition-all duration-100 hover:rotate-90 active:scale-95"
            onClick={onClose}
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body - scrollable */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-grow">
          {children}
        </div>

        {/* Modal footer */}
        {footer && (
          <div className="flex-shrink-0 border-t border-gray-200 px-4 sm:px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
