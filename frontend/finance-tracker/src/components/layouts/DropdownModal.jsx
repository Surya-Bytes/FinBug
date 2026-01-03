import React, { useEffect, useRef } from "react";
import { LuX } from "react-icons/lu";

const DropdownModal = ({
  children,
  isOpen,
  onClose,
  title,
  triggerRef,
  footer,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is on emoji picker (which is portaled to body)
      const isEmojiPicker = event.target.closest('.emoji-picker-mobile') ||
        event.target.closest('.emoji-picker-backdrop') ||
        event.target.closest('[class*="EmojiPicker"]');

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef?.current &&
        !triggerRef.current.contains(event.target) &&
        !isEmojiPicker
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  // Get position of trigger button
  const buttonRect = triggerRef?.current?.getBoundingClientRect();
  const isMobile = window.innerWidth < 768;

  // Position directly below the button for both mobile and desktop
  const dropdownStyle = buttonRect
    ? isMobile
      ? {
        position: "absolute",
        top: `${buttonRect.bottom + window.scrollY + 8}px`,
        left: `${Math.max(16, buttonRect.left + window.scrollX)}px`,
        right: `${Math.max(16, window.innerWidth - buttonRect.right + window.scrollX)}px`,
        maxWidth: "calc(100vw - 32px)",
      }
      : {
        position: "absolute",
        top: `${buttonRect.bottom + window.scrollY + 8}px`,
        right: `${window.innerWidth - buttonRect.right + window.scrollX}px`,
        minWidth: "500px",
        maxWidth: "600px",
      }
    : {};

  return (
    <>
      <div
        ref={dropdownRef}
        className="fixed z-50 animate-slide-down will-change-transform"
        style={dropdownStyle}
      >
        <div className="bg-white shadow-2xl border border-gray-200 overflow-hidden flex flex-col rounded-xl max-h-[calc(100vh-120px)] will-change-transform">
          {/* Header */}
          <div className={`flex items-center justify-between bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex-shrink-0 ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}>
            <h3 className={`font-bold text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>{title}</h3>

            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl text-sm w-9 h-9 inline-flex justify-center items-center cursor-pointer transition-colors duration-100 hover:rotate-90 active:scale-95 will-change-transform"
              onClick={onClose}
            >
              <LuX className="w-5 h-5" />
            </button>
          </div>

          {/* Body - scrollable */}
          <div className={`overflow-y-auto flex-grow ${isMobile ? 'p-4' : 'p-6'} overscroll-contain`} style={{ WebkitOverflowScrolling: 'touch' }}>{children}</div>

          {/* Footer */}
          {footer && (
            <div className={`flex-shrink-0 border-t border-gray-200 ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DropdownModal;
