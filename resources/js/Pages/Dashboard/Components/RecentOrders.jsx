// Pages/Dashboard/RecentOrders.jsx
import React from "react";

export default function RecentOrders() {
    const orders = [
        {
            id: "ORD-2023-0748",
            customer: "Reliance Industries Ltd.",
            product: "Sulfuric Acid",
            amount: "₹1,85,000",
            status: "Delivered",
            date: "July 15, 2023",
            statusColor: "green",
        },
        {
            id: "ORD-2023-0747",
            customer: "Tata Chemicals",
            product: "Hydrochloric Acid",
            amount: "₹98,500",
            status: "Processing",
            date: "July 14, 2023",
            statusColor: "yellow",
        },
        {
            id: "ORD-2023-0746",
            customer: "Hindustan Zinc Ltd",
            product: "Nitric Acid",
            amount: "₹64,200",
            status: "Processing",
            date: "July 13, 2023",
            statusColor: "yellow",
        },
        {
            id: "ORD-2023-0745",
            customer: "Vedanta Ltd",
            product: "Phosphoric Acid",
            amount: "₹1,25,750",
            status: "Pending Payment",
            date: "July 12, 2023",
            statusColor: "red",
        },
        {
            id: "ORD-2023-0744",
            customer: "UPL Limited",
            product: "Sulfuric Acid",
            amount: "₹2,15,000",
            status: "Delivered",
            date: "July 10, 2023",
            statusColor: "green",
        },
    ];

    return (
        <div className="bg-white shadow sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h2 className="text-lg font-medium text-gray-900">
                            Recent Orders
                        </h2>
                        <p className="mt-2 text-sm text-gray-700">
                            A list of the most recent orders placed by
                            customers.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                        >
                            View All Orders
                        </button>
                    </div>
                </div>
                <div className="mt-6 overflow-hidden border-t border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                    >
                                        Order ID
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Customer
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Product
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
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                            {order.id}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {order.customer}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {order.product}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {order.amount}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <span
                                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                    order.statusColor ===
                                                    "green"
                                                        ? "bg-green-100 text-green-800"
                                                        : order.statusColor ===
                                                          "yellow"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {order.date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
