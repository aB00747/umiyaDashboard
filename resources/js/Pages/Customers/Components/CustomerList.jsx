import React, { useState } from "react";
import {
    UserIcon,
    PhoneIcon,
    BuildingOfficeIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import CustomerDialog from "../Dialog/CustomerDialog";

/**
 * CustomerList component
 *
 * This component renders a list of customers with a button to add a new customer
 * and a button to export the list of customers. It also renders a modal dialog
 * for adding a new customer.
 *
 * @param {array} customers - The list of customers to display
 * @param {string} selectedCustomer - The id of the currently selected customer
 * @param {function} setSelectedCustomer - Function to call when the selected customer changes
 * @param {function} onAddCustomer - Function to call when a new customer is added
 * @returns {JSX.Element} The component
 */
export default function CustomerList({
    customers,
    selectedCustomer,
    setSelectedCustomer,
    onAddCustomer // New prop for handling customer addition
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [newCustomer, setNewCustomer] = useState({
        id: "",
        firstName: "",
        lastName: "",
        companyName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        stateCode: "",
        country: "",
        countryCode: "",
        pinCode: "",
        phone: "",
        alternatePhone: "",
        email: "",
        gstin: "",
        pan: "",
        customerType: "Individual",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    console.log("newCustomer", newCustomer);

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Customers</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {customers.length} Total
                </span>
            </div>

            <ul className="divide-y divide-gray-200 overflow-y-auto max-h-96">
                {customers.length > 0 ? (
                    customers.map((customer) => (
                        <li
                            key={customer.id}
                            className={`px-4 py-4 cursor-pointer hover:bg-gray-50 ${
                                selectedCustomer === customer.id
                                    ? "bg-blue-50"
                                    : ""
                            }`}
                            onClick={() => setSelectedCustomer(customer.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div
                                        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                                            customer.status === "Active"
                                                ? "bg-green-100"
                                                : "bg-gray-100"
                                        }`}
                                    >
                                        {customer.category === "Corporate" ? (
                                            <BuildingOfficeIcon className="h-5 w-5 text-gray-600" />
                                        ) : (
                                            <UserIcon className="h-5 w-5 text-gray-600" />
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-900">
                                                {customer.name}
                                            </span>
                                            {customer.status === "Active" ? (
                                                <CheckCircleIcon className="ml-1 h-4 w-4 text-green-500" />
                                            ) : (
                                                <XCircleIcon className="ml-1 h-4 w-4 text-red-500" />
                                            )}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                            <span className="mr-2">
                                                {customer.category}
                                            </span>
                                            <span>•</span>
                                            <span className="ml-2">
                                                Last order:{" "}
                                                {new Date(
                                                    customer.lastOrder
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                                    <span className="text-xs text-gray-500">
                                        {customer.phone.slice(-10)}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="px-4 py-12 text-center">
                        <p className="text-sm text-gray-500">
                            No customers found matching your criteria.
                        </p>
                    </li>
                )}
            </ul>

            <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add New Customer
                </button>
                <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Export List
                </button>
            </div>

            {/* Add Customer Modal */}
            {isModalOpen && (
                <CustomerDialog 
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    newCustomer={newCustomer}
                    setNewCustomer={setNewCustomer}
                    onAddCustomer={onAddCustomer}
                />
            )}
        </div>
    );
}