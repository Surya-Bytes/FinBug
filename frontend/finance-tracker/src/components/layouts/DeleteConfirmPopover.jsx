import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const DeleteConfirmPopover = ({ isOpen, onClose, onConfirm, triggerRef }) => {
    const popoverRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target) && 
                triggerRef?.current && !triggerRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, triggerRef]);

    if (!isOpen || !triggerRef?.current) return null;

    // Get position of trigger button
    const buttonRect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 280;
    const popoverHeight = 130;
    const margin = 12;
    
    // Position popover to the LEFT of the delete button (since button is on the right side)
    // Align vertically centered with the button
    const top = buttonRect.top + (buttonRect.height / 2) - (popoverHeight / 2);
    const left = buttonRect.left - popoverWidth - margin;
    
    const popoverStyle = {
        position: 'fixed',
        top: `${Math.max(margin, Math.min(top, window.innerHeight - popoverHeight - margin))}px`,
        left: `${Math.max(margin, left)}px`,
        zIndex: 9999,
    };

    const popoverContent = (
        <div
            ref={popoverRef}
            className="animate-scale-in"
            style={popoverStyle}
        >
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden relative" style={{ width: `${popoverWidth}px` }}>
                {/* Arrow pointing to the delete button on the right */}
                <div 
                    className="absolute top-1/2 -translate-y-1/2 w-0 h-0"
                    style={{
                        right: '-10px',
                        borderTop: '10px solid transparent',
                        borderBottom: '10px solid transparent',
                        borderLeft: '10px solid white',
                    }}
                />
                <div className="p-4">
                    <p className="text-sm text-gray-700 mb-4">
                        Are you sure you want to delete this? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2">
                        <button 
                            type="button"
                            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button"
                            className="px-3 py-1.5 text-sm bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
                            onClick={onConfirm}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(popoverContent, document.body);
};

export default DeleteConfirmPopover;
