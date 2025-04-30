// Pages/Customers/Components/CustomerFilters.jsx
import React from "react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

export default function CustomerFilters({ filters, setFilters }) {
    // Handle search input change
    const handleSearchChange = (e) => {
        setFilters({
            ...filters,
            search: e.target.value,
        });
    };

    // Handle status filter change
    const handleStatusChange = (e) => {
        setFilters({
            ...filters,
            status: e.target.value,
        });
    };

    // Handle category filter change
    const handleCategoryChange = (e) => {
        setFilters({
            ...filters,
            category: e.target.value,
        });
    };

    // Handle sort option change
    const handleSortChange = (e) => {
        setFilters({
            ...filters,
            sortBy: e.target.value,
        });
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            search: "",
            status: "all",
            category: "all",
            sortBy: "name",
        });
    };

    return (
        <div className="bg-white p-4 shadow rounded-lg">
            <div className="space-y-4">
                {/* Search Input */}
                <div>
                    <label
                        htmlFor="search"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Search Customers
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </div>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            value={filters.search}
                            onChange={handleSearchChange}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Name or contact person..."
                        />
                    </div>
                </div>

                {/* Filter Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center">
                        <FunnelIcon className="h-4 w-4 mr-1" />
                        Filter Options
                    </h3>
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="text-xs text-indigo-600 hover:text-indigo-900"
                    >
                        Clear all
                    </button>
                </div>

                {/* Status Filter */}
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
                        value={filters.status}
                        onChange={handleStatusChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {/* Category Filter */}
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
                        value={filters.category}
                        onChange={handleCategoryChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="all">All Categories</option>
                        <option value="corporate">Corporate</option>
                        <option value="distributor">Distributor</option>
                        <option value="manufacturer">Manufacturer</option>
                    </select>
                </div>

                {/* Sort Options */}
                <div>
                    <label
                        htmlFor="sortBy"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Sort By
                    </label>
                    <select
                        id="sortBy"
                        name="sortBy"
                        value={filters.sortBy}
                        onChange={handleSortChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="name">Name (A-Z)</option>
                        <option value="recent">Recent Orders</option>
                        <option value="revenue">Highest Revenue</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
