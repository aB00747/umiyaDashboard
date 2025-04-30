import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
// import '../../../../sass/app.scss';

export default function CustomerDialog({
    isModalOpen,
    setIsModalOpen,
    newCustomer,
    setNewCustomer,
    onAddCustomer,
}) {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Call the parent component's onAddCustomer function with the new customer data
        if (onAddCustomer) {
            onAddCustomer({
                ...newCustomer,
                id: Date.now().toString(), // Simple way to generate a unique ID
            });
        }

        // Reset form and close modal
        setNewCustomer({
            name: "",
            phone: "",
            category: "Individual",
            status: "Active",
            lastOrder: new Date().toISOString(),
        });
        setIsModalOpen(false);
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                    {/* <h3 className="text-lg font-medium text-gray-900">
                        Add New Customer
                    </h3> */}
                    <h3 className="newTest123">
                        Add New Customer
                    </h3>
                    <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4">
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                value={newCustomer.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Enter customer name"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                required
                                value={newCustomer.phone}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="category"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={newCustomer.category}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="Individual">Individual</option>
                                <option value="Corporate">Corporate</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="status"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={newCustomer.status}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
