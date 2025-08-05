import React from "react";
import PropTypes from "prop-types";

const Dialog = ({
    isOpen = false,
    onClose,
    title,
    children,
    size = "medium",
    showCloseButton = true,
    closeOnOverlayClick = true,
    className = "",
    overlayClassName = "",
    contentClassName = "",
}) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) {
            onClose();
        }
    };

    const sizeClasses = {
        small: "max-w-md",
        medium: "max-w-2xl",
        large: "max-w-4xl",
        xlarge: "max-w-6xl",
        full: "max-w-full mx-4",
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 ${overlayClassName}`}
            onClick={handleOverlayClick}
        >
            <div
                className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] flex flex-col ${className}`}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                        {title && (
                            <h2 className="text-lg font-semibold text-gray-900">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Close dialog"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className={`flex-1 overflow-y-auto ${contentClassName}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

Dialog.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    size: PropTypes.oneOf(["small", "medium", "large", "xlarge", "full"]),
    showCloseButton: PropTypes.bool,
    closeOnOverlayClick: PropTypes.bool,
    className: PropTypes.string,
    overlayClassName: PropTypes.string,
    contentClassName: PropTypes.string,
};

export default Dialog;