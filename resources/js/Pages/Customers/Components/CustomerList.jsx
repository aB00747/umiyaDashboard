import React, { useState, memo, useCallback, useMemo } from "react";
import {
    UserIcon,
    PhoneIcon,
    BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import CustomerDialog from "../Dialog/CustomerDialog";

// Memoized Customer List Item component
const CustomerListItem = memo(({ customer, isSelected, onSelect }) => {
    // Memoized status class calculation
    const statusClass = useMemo(
        () => (customer.is_active ? "bg-green-100" : "bg-gray-100"),
        [customer.is_active]
    );

    // Memoized formatted phone number
    const formattedPhone = useMemo(
        () => customer.phone?.slice(-10) || "N/A",
        [customer.phone]
    );

    // Memoized formatted last order date
    const formattedLastOrder = useMemo(
        () =>
            customer.lastOrder
                ? new Date(customer.lastOrder).toLocaleDateString()
                : "N/A",
        [customer.lastOrder]
    );

    // Memoized icon component
    const CategoryIcon = useMemo(
        () =>
            customer.category === "Corporate" ? BuildingOfficeIcon : UserIcon,
        [customer.category]
    );

    // Memoized status icon
    const StatusIcon = useMemo(
        () => (customer.is_active ? CheckCircleIcon : XCircleIcon),
        [customer.is_active]
    );

    const handleClick = useCallback(() => {
        onSelect(customer.id);
    }, [customer.id, onSelect]);

    return (
        <li
            className={`px-4 py-4 cursor-pointer transition-colors duration-150 hover:bg-gray-50 ${
                isSelected ? "bg-blue-50 border-l-2 border-blue-500" : ""
            }`}
            onClick={handleClick}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div
                        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${statusClass}`}
                    >
                        <CategoryIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="ml-4">
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                                {customer.company_name}
                            </span>
                            <StatusIcon
                                className={`ml-1 h-4 w-4 ${
                                    customer.is_active
                                        ? "text-green-500"
                                        : "text-red-500"
                                }`}
                            />
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span className="mr-2">{customer.category}</span>
                            <span>•</span>
                            <span className="ml-2">
                                Last order: {formattedLastOrder}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">
                        {formattedPhone}
                    </span>
                </div>
            </div>
        </li>
    );
});

CustomerListItem.displayName = "CustomerListItem";

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
 * @param {function} onExportCustomers - Function to call when export is requested
 * @returns {JSX.Element} The component
 */
const CustomerList = ({
    customers = [],
    selectedCustomer,
    setSelectedCustomer,
    onAddCustomer,
    onExportCustomers,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Memoized customer count for performance
    const customerCount = useMemo(() => customers.length, [customers.length]);

    const handleCustomerSelect = useCallback(
        (customerId) => {
            setSelectedCustomer(customerId);
        },
        [setSelectedCustomer]
    );

    const handleModalOpen = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleAddCustomer = useCallback(
        (customerData) => {
            onAddCustomer?.(customerData);
            setIsModalOpen(false);
        },
        [onAddCustomer]
    );

    const handleExport = useCallback(() => {
        onExportCustomers?.();
    }, [onExportCustomers]);

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Customers</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {customerCount} Total
                </span>
            </div>

            <ul className="divide-y divide-gray-200 overflow-y-auto max-h-96">
                {customerCount > 0 ? (
                    customers.map((customer) => (
                        <CustomerListItem
                            key={customer.id}
                            customer={customer}
                            isSelected={selectedCustomer === customer.id}
                            onSelect={handleCustomerSelect}
                        />
                    ))
                ) : (
                    <li className="px-4 py-12 text-center">
                        <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                            No customers found matching your criteria.
                        </p>
                    </li>
                )}
            </ul>

            <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-150"
                    onClick={handleModalOpen}
                >
                    Add New Customer
                </button>
                <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-150"
                    onClick={handleExport}
                >
                    Export List
                </button>
            </div>

            {/* Add Customer Modal */}
            {isModalOpen && (
                <CustomerDialog
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onAddCustomer={handleAddCustomer}
                />
            )}
        </div>
    );
};

CustomerList.displayName = "CustomerList";

export default memo(CustomerList);
