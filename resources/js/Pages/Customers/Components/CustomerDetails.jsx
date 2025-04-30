// Pages/Customers/Components/CustomerDetails.jsx
import React, { useState } from "react";
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    CurrencyRupeeIcon,
    CalendarDaysIcon,
    ClockIcon,
    TruckIcon,
} from "@heroicons/react/24/outline";
import {
    PencilSquareIcon,
    ArrowPathIcon,
    TrashIcon,
    ChatBubbleLeftIcon,
    DocumentTextIcon,
    PaperClipIcon,
} from "@heroicons/react/24/solid";

export default function CustomerDetails({ customer }) {
    const [activeTab, setActiveTab] = useState("overview");

    if (!customer) {
        return (
            <div className="app-card">
                <div className="p-8 text-center">
                    <svg
                        className="mx-auto h-16 w-16 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                        No customer selected
                    </h3>
                    <p className="mt-2 app-text">
                        Select a customer from the list to view their details,
                        orders, and history.
                    </p>
                </div>
            </div>
        );
    }

    // Sample order data for the selected customer
    const recentOrders = [
        {
            id: "ORD-2023-0748",
            date: "2023-07-15",
            products: ["Sulfuric Acid", "Hydrochloric Acid"],
            amount: "₹1,85,000",
            status: "Delivered",
        },
        {
            id: "ORD-2023-0723",
            date: "2023-06-22",
            products: ["Phosphoric Acid", "Nitric Acid"],
            amount: "₹1,25,000",
            status: "Delivered",
        },
        {
            id: "ORD-2023-0698",
            date: "2023-05-10",
            products: ["Sulfuric Acid"],
            amount: "₹85,000",
            status: "Delivered",
        },
        {
            id: "ORD-2023-0652",
            date: "2023-04-18",
            products: ["Hydrochloric Acid", "Acetic Acid"],
            amount: "₹1,10,000",
            status: "Delivered",
        },
    ];

    // Sample interaction data for the selected customer
    const interactions = [
        {
            id: 1,
            type: "Call",
            date: "2023-07-10",
            description: "Discussed upcoming order requirements",
            user: "Anand Patel",
        },
        {
            id: 2,
            type: "Email",
            date: "2023-06-30",
            description: "Sent quotation for new products",
            user: "Prakash Mehta",
        },
        {
            id: 3,
            type: "Meeting",
            date: "2023-06-15",
            description: "Quarterly business review",
            user: "Anand Patel",
        },
        {
            id: 4,
            type: "Call",
            date: "2023-05-28",
            description: "Follow-up on delivery concerns",
            user: "Prakash Mehta",
        },
    ];

    // Sample documents for the selected customer
    const documents = [
        {
            id: 1,
            name: "Contract Agreement.pdf",
            type: "PDF",
            size: "2.4 MB",
            date: "2023-01-15",
            category: "Legal",
        },
        {
            id: 2,
            name: "Credit Application.docx",
            type: "DOCX",
            size: "540 KB",
            date: "2023-01-10",
            category: "Financial",
        },
        {
            id: 3,
            name: "Product Requirements.xlsx",
            type: "XLSX",
            size: "1.2 MB",
            date: "2023-03-22",
            category: "Technical",
        },
        {
            id: 4,
            name: "Meeting Notes - Q2 2023.pdf",
            type: "PDF",
            size: "890 KB",
            date: "2023-06-15",
            category: "Meeting",
        },
    ];

    return (
        <div className="app-card">
            {/* Customer Header */}
            <div className="app-card-header">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {customer.name}
                        </h2>
                        <p className="app-text">
                            <span
                                className={`badge ${
                                    customer.status === "Active"
                                        ? "badge-success"
                                        : "badge-danger"
                                }`}
                            >
                                {customer.status}
                            </span>
                            <span className="ml-2">{customer.category}</span>
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            <PencilSquareIcon className="-ml-0.5 mr-2 h-4 w-4" />
                            Edit
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            <ArrowPathIcon className="-ml-0.5 mr-2 h-4 w-4" />
                            Refresh
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-transparent bg-red-50 px-3 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-100"
                        >
                            <TrashIcon className="-ml-0.5 mr-2 h-4 w-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex px-6 space-x-8" aria-label="Tabs">
                    {["overview", "orders", "interactions", "documents"].map(
                        (tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${
                                    activeTab === tab
                                        ? "border-indigo-500 text-indigo-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                            >
                                {tab}
                            </button>
                        )
                    )}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="app-card-body">
                {activeTab === "overview" && (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-4">
                                    Contact Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-900">
                                            {customer.contactPerson}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-900">
                                            {customer.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-900">
                                            {customer.phone}
                                        </span>
                                    </div>
                                    <div className="flex items-start">
                                        <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                        <span className="text-sm text-gray-900">
                                            {customer.address}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-4">
                                    Financial Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <CurrencyRupeeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-500">
                                                Credit Limit
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            {customer.creditLimit}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <CurrencyRupeeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-500">
                                                Outstanding
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            {customer.outstanding}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <CurrencyRupeeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-500">
                                                Total Revenue
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            {customer.revenue}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <TruckIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-500">
                                                Total Orders
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            {customer.orders}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-500 mb-4">
                                Timeline & Activity
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-500">
                                            Customer Since
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {new Date(
                                            customer.joinDate
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-500">
                                            Last Order Date
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {new Date(
                                            customer.lastOrder
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-500">
                                            Last Interaction
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {new Date(
                                            interactions[0].date
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "orders" && (
                    <div>
                        <div className="mb-4 flex justify-between items-center">
                            <h3 className="app-heading-3">Order History</h3>
                            <button type="button" className="btn btn-primary">
                                Create New Order
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Order ID
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Date
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Products
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Amount
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative px-3 py-3.5"
                                        >
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-indigo-600">
                                                {order.id}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {new Date(
                                                    order.date
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500">
                                                {order.products.map(
                                                    (product, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 mr-1 mb-1"
                                                        >
                                                            {product}
                                                        </span>
                                                    )
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {order.amount}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                                                        order.status ===
                                                        "Delivered"
                                                            ? "bg-green-100 text-green-800"
                                                            : order.status ===
                                                              "Processing"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                                                <a
                                                    href="#"
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    View
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "interactions" && (
                    <div>
                        <div className="mb-4 flex justify-between items-center">
                            <h3 className="app-heading-3">
                                Customer Interactions
                            </h3>
                            <button type="button" className="btn btn-primary">
                                Log New Interaction
                            </button>
                        </div>
                        <div className="overflow-hidden border border-gray-200 rounded-lg">
                            <ul className="divide-y divide-gray-200">
                                {interactions.map((interaction) => (
                                    <li
                                        key={interaction.id}
                                        className="p-4 hover:bg-gray-50"
                                    >
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 mt-1">
                                                <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-gray-900">
                                                        {interaction.type}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(
                                                            interaction.date
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {interaction.description}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    Logged by:{" "}
                                                    {interaction.user}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 w-full"
                            >
                                View All Interactions
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === "documents" && (
                    <div>
                        <div className="mb-4 flex justify-between items-center">
                            <h3 className="app-heading-3">
                                Customer Documents
                            </h3>
                            <button type="button" className="btn btn-primary">
                                Upload Document
                            </button>
                        </div>
                        <div className="overflow-hidden border border-gray-200 rounded-lg">
                            <ul className="divide-y divide-gray-200">
                                {documents.map((document) => (
                                    <li
                                        key={document.id}
                                        className="p-4 hover:bg-gray-50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <DocumentTextIcon className="h-6 w-6 text-indigo-500" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {document.name}
                                                    </p>
                                                    <div className="flex text-xs text-gray-500 mt-1">
                                                        <span>
                                                            {document.type}
                                                        </span>
                                                        <span className="mx-1">
                                                            •
                                                        </span>
                                                        <span>
                                                            {document.size}
                                                        </span>
                                                        <span className="mx-1">
                                                            •
                                                        </span>
                                                        <span>
                                                            {document.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-1">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                                >
                                                    Download
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
