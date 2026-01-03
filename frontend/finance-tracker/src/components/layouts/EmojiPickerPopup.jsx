import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { createPortal } from 'react-dom';
import { LuX, LuSmile } from 'react-icons/lu';

const EmojiPickerPopup = ({ icon, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPositioned, setIsPositioned] = useState(false);
    const pickerRef = useRef(null);
    const containerRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    // Calculate position for the picker - runs immediately when opened
    const calculatePosition = useCallback(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const scrollY = window.scrollY || window.pageYOffset;
            const scrollX = window.scrollX || window.pageXOffset;

            // Position below the button
            const pickerWidth = 380;
            const pickerHeight = 400;

            // Center horizontally relative to button
            let left = rect.left + scrollX + (rect.width / 2);
            let top = rect.bottom + scrollY + 8;

            // Check if it goes off screen right
            if (left + pickerWidth / 2 > window.innerWidth + scrollX - 20) {
                left = window.innerWidth + scrollX - pickerWidth / 2 - 20;
            }
            // Check if it goes off screen left
            if (left - pickerWidth / 2 < scrollX + 20) {
                left = scrollX + pickerWidth / 2 + 20;
            }

            // Check if it goes off screen bottom
            if (top + pickerHeight > window.innerHeight + scrollY - 20) {
                // Position above button instead
                top = rect.top + scrollY - pickerHeight - 8;
            }

            setPosition({ top, left });
            setIsPositioned(true);
        }
    }, []);

    // Calculate position synchronously before paint - prevents flash
    useLayoutEffect(() => {
        if (isOpen && containerRef.current) {
            // Reset positioned state
            setIsPositioned(false);

            // Calculate position synchronously before browser paint
            calculatePosition();
        } else {
            setIsPositioned(false);
        }
    }, [isOpen, calculatePosition]);

    // Update position on scroll/resize (after initial positioning)
    useEffect(() => {
        if (isOpen && isPositioned) {
            const updatePosition = () => {
                calculatePosition();
            };

            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);

            return () => {
                window.removeEventListener('scroll', updatePosition, true);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [isOpen, isPositioned, calculatePosition]);

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen &&
                pickerRef.current &&
                containerRef.current &&
                !containerRef.current.contains(event.target) &&
                !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            // Small delay to avoid immediate close
            const timeout = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 50);

            return () => {
                clearTimeout(timeout);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);

    return (
        <>
            {/* Icon Display/Selector Button */}
            <div
                ref={containerRef}
                className="relative group flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-150"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="w-14 h-14 flex items-center justify-center text-2xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 rounded-xl transition-all duration-200 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md">
                    {icon ? (
                        // Check if icon is a URL (starts with http) or a native emoji
                        icon.startsWith('http') ? (
                            <img src={icon} alt="icon" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                            <span className="text-3xl">{icon}</span>
                        )
                    ) : (
                        <LuSmile className="w-6 h-6" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors duration-150">
                        {icon ? "Change Icon" : "Pick an Icon"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {icon ? "Click to change" : "Click to select emoji"}
                    </p>
                </div>

                <div className="text-gray-400 group-hover:text-purple-600 transition-colors duration-150 flex-shrink-0">
                    {isOpen ? (
                        <LuX className="w-5 h-5 animate-fade-in" />
                    ) : (
                        <LuSmile className="w-5 h-5" />
                    )}
                </div>
            </div>

            {/* Emoji Picker Popup - Positioned as dropdown - only render when positioned */}
            {isOpen && isPositioned && typeof document !== 'undefined' && createPortal(
                <>
                    {/* Mobile backdrop */}
                    <div
                        className="emoji-picker-backdrop sm:hidden"
                        onClick={() => setIsOpen(false)}
                    />

                    <div
                        ref={pickerRef}
                        className="emoji-picker-mobile fixed z-[9999] animate-slide-down sm:animate-slide-down"
                        style={{
                            top: `${position.top}px`,
                            left: `${position.left}px`,
                            transform: 'translateX(-50%)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden w-[380px] backdrop-blur-sm">
                            <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-gray-200 flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-700">Select Emoji</p>
                                <button
                                    className="w-7 h-7 flex items-center justify-center bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 border border-gray-200 rounded-lg cursor-pointer transition-all duration-150 hover:scale-110 active:scale-95"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsOpen(false);
                                    }}
                                >
                                    <LuX className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto overscroll-contain">
                                <EmojiPicker
                                    open={isOpen}
                                    onEmojiClick={(emoji) => {
                                        // Use emoji unicode for native emojis, fallback to imageUrl for compatibility
                                        const emojiValue = emoji?.emoji || emoji?.imageUrl || "";
                                        onSelect(emojiValue);
                                        setIsOpen(false);
                                    }}
                                    skinTonesDisabled
                                    previewConfig={{ showPreview: false }}
                                    width={380}
                                    height={400}
                                    lazyLoadEmojis={true}
                                    searchPlaceHolder="Search emojis..."
                                    emojiStyle="native"
                                />
                            </div>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </>
    )
}

export default EmojiPickerPopup