// resources/js/Pages/Customers/Index.jsx
import { useState, useEffect, useCallback } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import CustomerList from "./Components/CustomerList";
import CustomerDetails from "./Components/CustomerDetails";
import CustomerStatistics from "./Components/CustomerStatistics";
import CustomerFilters from "./Components/CustomerFilters";
import CustomerTable from "./Components/CustomerTable";
import CustomerAPI from "@/Services/api/CustomerAPI";
import RefreshButton from "./Components/RefreshButton";

// Import notifications
import { notifications } from "@/utils/notifications";

/**
 * Customers page component
 *
 * Handles customer data display, filtering, sorting, and view switching
 *
 * @param {object} auth - Authenticated user data
 * @param {array} customers - List of customer objects
 *
 * @returns {JSX.Element} Customers page component
 */
export default function Customers({ auth, customers }) {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerFilters, setFilters] = useState({
        search: "",
        status: "all",
        category: "all",
        sortBy: "name",
    });
    const [activeView, setActiveView] = useState("info"); // 'info' or 'table'
    const [isLoading, setIsLoading] = useState(false);
    const [apiCustomers, setApiCustomers] = useState(null);
    const [hasError, setHasError] = useState(false);

    // Function to refresh customers data
    const fetchCustomersData = async (filters = {}) => {
        try {
            setIsLoading(true);
            setHasError(false);

            const customersResponse = await CustomerAPI.getAll(filters);
            console.log("Fetched customers data:", customersResponse);

            // Store the fetched data in state
            setApiCustomers(customersResponse.data || customersResponse);
        } catch (error) {
            console.error("Error fetching customers:", error);
            setHasError(true);
            notifications.apiError("fetch", error, "Customers");
        } finally {
            setIsLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchCustomersData(customerFilters);
    }, []);

    // Refetch when filters change (with debounce for search)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (customerFilters.search || Object.keys(customerFilters).some(key => 
                key !== 'search' && customerFilters[key] !== (key === 'sortBy' ? 'name' : 'all')
            )) {
                fetchCustomersData(customerFilters);
            }
        }, 500); // 500ms debounce for search

        return () => clearTimeout(timeoutId);
    }, [customerFilters]);

    // Handle customer operations (create, update, delete)
    const handleCustomerOperation = useCallback(async (
        operation,
        customerId = null,
        customerData = null
    ) => {
        try {
            setIsLoading(true);
            let operationResult;

            switch (operation) {
                case "delete":
                    operationResult = await CustomerAPI.delete(customerId);
                    notifications.apiSuccess("delete", "Customer");
                    break;
                case "activate":
                    operationResult = await CustomerAPI.update(customerId, {
                        is_active: true,
                    });
                    notifications.success("Customer activated successfully!");
                    break;
                case "deactivate":
                    operationResult = await CustomerAPI.update(customerId, {
                        is_active: false,
                    });
                    notifications.success("Customer deactivated successfully!");
                    break;
                case "create":
                    operationResult = await CustomerAPI.create(customerData);
                    notifications.apiSuccess("create", "Customer");
                    break;
                case "update":
                    operationResult = await CustomerAPI.update(
                        customerId,
                        customerData
                    );
                    notifications.apiSuccess("update", "Customer");
                    break;
                default:
                    notifications.warning("Unknown operation");
                    return;
            }

            // Refresh the customers list after operation
            await fetchCustomersData(customerFilters);
        } catch (error) {
            console.error(`Error during ${operation}:`, error);
            notifications.apiError(operation, error, "Customer");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Use API data when available, fallback to props data if needed
    const displayCustomers = apiCustomers || customers || [];

    // Apply filters to customer list
    const filteredCustomers = displayCustomers.filter((customer) => {
        // Search filter - check name and contact person
        const searchTerm = customerFilters.search.toLowerCase();
        const matchesSearch =
            !searchTerm ||
            customer.name?.toLowerCase().includes(searchTerm) ||
            customer.contactPerson?.toLowerCase().includes(searchTerm) ||
            customer.contact_person?.toLowerCase().includes(searchTerm); // Handle different naming conventions

        // Status filter
        const matchesStatus =
            customerFilters.status === "all" ||
            customer.status?.toLowerCase() ===
                customerFilters.status.toLowerCase() ||
            (customer.is_active !== undefined
                ? customerFilters.status === "active"
                    ? customer.is_active
                    : !customer.is_active
                : true);

        // Category filter
        const matchesCategory =
            customerFilters.category === "all" ||
            customer.category?.toLowerCase() ===
                customerFilters.category.toLowerCase();

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort customers based on selected sort option
    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
        switch (customerFilters.sortBy) {
            case "name":
                return (a.name || "").localeCompare(b.name || "");
            case "recent":
                const dateA = new Date(a.lastOrder || a.last_order || 0);
                const dateB = new Date(b.lastOrder || b.last_order || 0);
                return dateB - dateA;
            case "revenue":
                const revenueA = parseFloat(
                    (a.revenue || a.total_revenue || "0")
                        .toString()
                        .replace(/[₹,]/g, "")
                );
                const revenueB = parseFloat(
                    (b.revenue || b.total_revenue || "0")
                        .toString()
                        .replace(/[₹,]/g, "")
                );
                return revenueB - revenueA;
            default:
                return 0;
        }
    });

    // Handle view switch based on sidebar navigation
    const handleViewChange = (view) => {
        setActiveView(view);
        notifications.info(
            `Switched to ${
                view === "info" ? "Customer Info" : "Customer Table"
            } view`
        );
    };

    // Handle filter changes
    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
        notifications.info("Filters updated");
    }, []);

    // Example of bulk operations
    const handleBulkOperation = (operation, selectedIds) => {
        const count = selectedIds.length;

        switch (operation) {
            case "delete":
                if (
                    confirm(
                        `Are you sure you want to delete ${count} customer${
                            count > 1 ? "s" : ""
                        }?`
                    )
                ) {
                    // Perform bulk delete
                    notifications.success(
                        `${count} customer${
                            count > 1 ? "s" : ""
                        } deleted successfully!`
                    );
                }
                break;
            case "export":
                notifications.info(
                    `Exporting ${count} customer${count > 1 ? "s" : ""}...`
                );
                // Perform export
                break;
            default:
                notifications.warning("Unknown bulk operation");
        }
    };

    const handleRefresh = useCallback(() => {
        fetchCustomersData(customerFilters);
    }, [customerFilters]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            currentPage="customers"
            activeTab={
                activeView === "info" ? "customers--info" : "customers--table"
            }
            setActiveTab={(tab) => {
                if (tab === "customers--info") setActiveView("info");
                if (tab === "customers--table") setActiveView("table");
            }}
        >
            <Head
                title={`Customers - ${
                    activeView === "info" ? "Info" : "Table"
                }`}
            />
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Customer Management
                        </h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Manage your customer relationships, view transaction
                            history, and analyze customer data.
                        </p>
                    </div>

                    {/* Loading State for Statistics */}
                    {isLoading && !displayCustomers.length ? (
                        <div className="mb-6 bg-white rounded-lg shadow p-6">
                            <div className="animate-pulse flex space-x-4">
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Customer Statistics Overview */
                        <CustomerStatistics customers={displayCustomers} />
                    )}

                    {/* Error State */}
                    {hasError && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Error Loading Customers
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>
                                            Unable to load customer data. Please try refreshing the page.
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            onClick={() => fetchCustomersData(customerFilters)}
                                            className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Toggle View */}
                    <div className="mt-6 mb-4">
                        <div className="inline-flex rounded-md shadow-sm">
                            <button
                                type="button"
                                onClick={() => handleViewChange("info")}
                                className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                                    activeView === "info"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                                disabled={isLoading}
                            >
                                Customer Info
                            </button>
                            <button
                                type="button"
                                onClick={() => handleViewChange("table")}
                                className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                                    activeView === "table"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                                disabled={isLoading}
                            >
                                Customer Table
                            </button>
                        </div>
                    </div>

                    {/* Content based on data availability */}
                    {!isLoading && !hasError && displayCustomers.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-12">
                            <div className="mx-auto h-12 w-12 text-gray-400">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by adding your first customer.
                            </p>
                        </div>
                    ) : activeView === "info" ? (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Left Column: Customer List with Filters */}
                            <div className="lg:col-span-1">
                                <RefreshButton
                                    handleRefresh={handleRefresh}
                                    isLoading={isLoading}
                                />
                                <CustomerFilters
                                    filters={customerFilters}
                                    setFilters={handleFilterChange}
                                />
                                <div className="mt-4">
                                    <CustomerList
                                        customers={sortedCustomers}
                                        selectedCustomer={selectedCustomer}
                                        setSelectedCustomer={
                                            setSelectedCustomer
                                        }
                                        onCustomerOperation={
                                            handleCustomerOperation
                                        }
                                        isLoading={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Right Column: Customer Details */}
                            <div className="lg:col-span-2">
                                <CustomerDetails
                                    customer={
                                        selectedCustomer
                                            ? sortedCustomers.find(
                                                  (c) =>
                                                      c.id === selectedCustomer
                                              )
                                            : null
                                    }
                                    onCustomerOperation={
                                        handleCustomerOperation
                                    }
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>
                    ) : (
                        <CustomerTable
                            customers={sortedCustomers}
                            onBulkOperation={handleBulkOperation}
                            onCustomerOperation={handleCustomerOperation}
                            isLoading={isLoading}
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
