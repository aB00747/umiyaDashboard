// Pages/Dashboard/InventoryStatus.jsx
import React from "react";

export default function InventoryStatus() {
    const inventory = [
        {
            id: 1,
            name: "Sulfuric Acid (H2SO4)",
            quantity: "8,500 L",
            status: "In Stock",
            statusColor: "green",
        },
        {
            id: 2,
            name: "Hydrochloric Acid (HCl)",
            quantity: "5,200 L",
            status: "In Stock",
            statusColor: "green",
        },
        {
            id: 3,
            name: "Phosphoric Acid (H3PO4)",
            quantity: "2,100 L",
            status: "Low Stock",
            statusColor: "yellow",
        },
        {
            id: 4,
            name: "Nitric Acid (HNO3)",
            quantity: "950 L",
            status: "Critical",
            statusColor: "red",
        },
        {
            id: 5,
            name: "Acetic Acid (CH3COOH)",
            quantity: "3,800 L",
            status: "In Stock",
            statusColor: "green",
        },
    ];

    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Inventory Status
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                <th
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                    Product
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                    Quantity
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {inventory.map((item) => (
                                <tr key={item.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        {item.name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {item.quantity}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span
                                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                item.statusColor === "green"
                                                    ? "bg-green-100 text-green-800"
                                                    : item.statusColor ===
                                                      "yellow"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
