// Pages/Customers/Index.jsx
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import CustomerList from "./Components/CustomerList";
import CustomerDetails from "./Components/CustomerDetails";
import CustomerStatistics from "./Components/CustomerStatistics";
import CustomerFilters from "./Components/CustomerFilters";
import CustomerTable from "./Components/CustomerTable";
import CustomerAPI from "@/Services/CustomerAPI";

export default function Customers({ auth, customers }) {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        category: "all",
        sortBy: "name",
    });


    let customersz = CustomerAPI.getAll(filters);

    console.log("customersz", customersz);





    const [activeView, setActiveView] = useState("info"); // 'info' or 'table'

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
                                    setFilters={setFilters}
                                />
                                <div className="mt-4">
                                    <CustomerList
                                        customers={sortedCustomers}
                                        selectedCustomer={selectedCustomer}
                                        setSelectedCustomer={
                                            setSelectedCustomer
                                        }
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
                                />
                            </div>
                        </div>
                    ) : (
                        <CustomerTable customers={sortedCustomers} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
