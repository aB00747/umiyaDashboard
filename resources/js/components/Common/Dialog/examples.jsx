import React, { useState } from "react";
import Dialog from "./index";

// Example 1: Simple confirmation dialog
export const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="small"
        >
            <div className="p-6">
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </Dialog>
    );
};

// Example 2: Form dialog
export const FormDialog = ({ isOpen, onClose, onSubmit, title }) => {
    const [formData, setFormData] = useState({ name: "", email: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="medium"
        >
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>
                <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </form>
        </Dialog>
    );
};

// Example 3: Info dialog without close button
export const InfoDialog = ({ isOpen, onClose, title, children }) => {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="medium"
            showCloseButton={false}
            closeOnOverlayClick={false}
        >
            <div className="p-6">
                {children}
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                        OK
                    </button>
                </div>
            </div>
        </Dialog>
    );
};