// resources/js/Pages/Customers/Index.jsx
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import CustomerList from "./Components/CustomerList";
import CustomerDetails from "./Components/CustomerDetails";
import CustomerStatistics from "./Components/CustomerStatistics";
import CustomerFilters from "./Components/CustomerFilters";
import CustomerTable from "./Components/CustomerTable";
import CustomerAPI from "@/Services/api/CustomerAPI";

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
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        category: "all",
        sortBy: "name",
    });
    const [activeView, setActiveView] = useState("info"); // 'info' or 'table'
    const [isLoading, setIsLoading] = useState(false);

    // Function to refresh customers data
    const refreshCustomers = async () => {
        try {
            setIsLoading(true);
            const customersData = await CustomerAPI.getAll(filters);
            console.log("customersData", customersData);

            // You might want to update state here or trigger a page refresh
            // depending on how your data flow works
        } catch (error) {
            console.error("Error fetching customers:", error);
            notifications.apiError("fetch", error, "Customers");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle customer operations (create, update, delete)
    const handleCustomerOperation = async (
        operation,
        customerId = null,
        customerData = null
    ) => {
        try {
            setIsLoading(true);
            let result;

            switch (operation) {
                case "delete":
                    result = await CustomerAPI.delete(customerId);
                    notifications.apiSuccess("delete", "Customer");
                    break;
                case "activate":
                    result = await CustomerAPI.update(customerId, {
                        is_active: true,
                    });
                    notifications.success("Customer activated successfully!");
                    break;
                case "deactivate":
                    result = await CustomerAPI.update(customerId, {
                        is_active: false,
                    });
                    notifications.success("Customer deactivated successfully!");
                    break;
                default:
                    notifications.warning("Unknown operation");
                    return;
            }

            // Refresh the customers list
            await refreshCustomers();
        } catch (error) {
            console.error(`Error during ${operation}:`, error);
            notifications.apiError(operation, error, "Customer");
        } finally {
            setIsLoading(false);
        }
    };

    // Sample data for demonstration - replace with actual data from your backend
    const sampleCustomers = [
        {
            id: 1,
            name: "Reliance Industries Ltd.",
            contactPerson: "Mukesh Shah",
            email: "procurement@reliance.com",
            phone: "+91 22 3456 7890",
            address: "Maker Chambers IV, Nariman Point, Mumbai 400021",
            category: "Corporate",
            status: "Active",
            creditLimit: "₹50,00,000",
            outstanding: "₹12,45,000",
            lastOrder: "2023-07-15",
            joinDate: "2018-04-10",
            orders: 145,
            revenue: "₹2,85,75,000",
        },
        {
            id: 2,
            name: "Tata Chemicals",
            contactPerson: "Ravi Patel",
            email: "ravi.patel@tatachemicals.com",
            phone: "+91 22 6665 8880",
            address: "Bombay House, 24 Homi Mody Street, Mumbai 400001",
            category: "Corporate",
            status: "Active",
            creditLimit: "₹45,00,000",
            outstanding: "₹8,75,000",
            lastOrder: "2023-07-10",
            joinDate: "2017-06-12",
            orders: 132,
            revenue: "₹2,25,40,000",
        },
        {
            id: 3,
            name: "Hindustan Zinc Ltd",
            contactPerson: "Anil Agarwal",
            email: "procurement@hzl.com",
            phone: "+91 294 660 3333",
            address: "Yashad Bhawan, Udaipur 313004, Rajasthan",
            category: "Corporate",
            status: "Active",
            creditLimit: "₹30,00,000",
            outstanding: "₹5,45,000",
            lastOrder: "2023-07-05",
            joinDate: "2019-02-18",
            orders: 78,
            revenue: "₹1,15,60,000",
        },
        {
            id: 4,
            name: "Shree Chemicals",
            contactPerson: "Rajesh Sharma",
            email: "rajesh@shreechemicals.com",
            phone: "+91 79 2658 4721",
            address: "456 GIDC, Vatva, Ahmedabad 382445, Gujarat",
            category: "Distributor",
            status: "Inactive",
            creditLimit: "₹15,00,000",
            outstanding: "₹4,25,000",
            lastOrder: "2023-03-20",
            joinDate: "2020-08-05",
            orders: 42,
            revenue: "₹65,75,000",
        },
        {
            id: 5,
            name: "Bharat Rasayan Ltd",
            contactPerson: "Sunil Gupta",
            email: "sunil@bharatrasayan.com",
            phone: "+91 11 4359 0000",
            address: "1501, Vikrant Tower, Rajendra Place, New Delhi 110008",
            category: "Manufacturer",
            status: "Active",
            creditLimit: "₹25,00,000",
            outstanding: "₹0",
            lastOrder: "2023-07-01",
            joinDate: "2021-01-15",
            orders: 35,
            revenue: "₹85,25,000",
        },
    ];

    // Use either actual data passed from backend or sample data
    const displayCustomers = customers || sampleCustomers;

    // Apply filters to customer list
    const filteredCustomers = displayCustomers.filter((customer) => {
        // Search filter
        const matchesSearch =
            customer.name
                .toLowerCase()
                .includes(filters.search.toLowerCase()) ||
            customer.contactPerson
                .toLowerCase()
                .includes(filters.search.toLowerCase());

        // Status filter
        const matchesStatus =
            filters.status === "all" ||
            customer.status.toLowerCase() === filters.status.toLowerCase();

        // Category filter
        const matchesCategory =
            filters.category === "all" ||
            customer.category.toLowerCase() === filters.category.toLowerCase();

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort customers based on selected sort option
    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
        switch (filters.sortBy) {
            case "name":
                return a.name.localeCompare(b.name);
            case "recent":
                return new Date(b.lastOrder) - new Date(a.lastOrder);
            case "revenue":
                return (
                    parseFloat(b.revenue.replace(/[₹,]/g, "")) -
                    parseFloat(a.revenue.replace(/[₹,]/g, ""))
                );
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
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        notifications.info("Filters updated");
    };

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

                    {/* Customer Statistics Overview */}
                    <CustomerStatistics customers={displayCustomers} />

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

                    {activeView === "info" ? (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Left Column: Customer List with Filters */}
                            <div className="lg:col-span-1">
                                <CustomerFilters
                                    filters={filters}
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
