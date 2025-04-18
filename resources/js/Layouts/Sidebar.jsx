import {
    Home,
    Users,
    Package,
    ShoppingCart,
    MessageSquare,
    FileText,
    Settings,
    Tag,
    Truck,
    BarChart2,
    Menu
} from "lucide-react";
import { Link } from '@inertiajs/react';

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) {
    // Navigation items configuration
    const navItems = [
        { id: 1, key: "dashboard", name: "Dashboard", icon: Home, route: 'dashboard' },
        { id: 2, key: "customers", name: "Customers", icon: Users, route: 'customers.index' },
        { id: 3, key: "inventory", name: "Inventory", icon: Package, route: 'inventory.index' },
        { id: 4, key: "orders", name: "Orders", icon: ShoppingCart, route: 'orders.index' },
        { id: 5, key: "pricing", name: "Pricing", icon: Tag, route: 'pricing.index' },
        { id: 6, key: "deliveries", name: "Deliveries", icon: Truck, route: 'deliveries.index' },
        { id: 7, key: "messaging", name: "Messaging", icon: MessageSquare, route: 'messaging.index' },
        { id: 8, key: "reports", name: "Reports", icon: BarChart2, route: 'reports.index' },
        { id: 9, key: "documents", name: "Documents", icon: FileText, route: 'documents.index' },
        { id: 10, key: "settings", name: "Settings", icon: Settings, route: 'settings.index' }
    ];

    const getRouteUrl = (routeName) => {
        try {
            return route(routeName);
        } catch (e) {
            // Fallback to a hash if route doesn't exist yet
            console.warn(`Route ${routeName} does not exist yet`);
            return '#';
        }
    };

    return (
        <div
            className={`${
                sidebarOpen ? "w-64" : "w-20"
            } bg-indigo-700 text-white transition-all duration-300 ease-in-out fixed h-full z-10`}
        >
            {/* Sidebar Header */}
            <div
                className={`p-4 flex ${
                    sidebarOpen ? "justify-between" : "justify-center"
                } items-center border-b border-indigo-600`}
            >
                {sidebarOpen && (
                    <div className="font-bold text-xl">Umiya Acid</div>
                )}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-1 rounded-md hover:bg-indigo-600"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Navigation Menu */}
            <div className="p-4">
                <nav>
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li
                                key={item.id}
                                className={`${
                                    activeTab === item.key
                                        ? "bg-indigo-800"
                                        : "hover:bg-indigo-600"
                                } rounded-md`}
                            >
                                <Link
                                    href={route(item.route)}
                                    onClick={() => setActiveTab(item.key)}
                                    className={`flex items-center ${
                                        sidebarOpen
                                            ? "w-full px-4"
                                            : "justify-center"
                                    } py-2 rounded-md`}
                                >
                                    <item.icon size={20} />
                                    {sidebarOpen && (
                                        <span className="ml-3">{item.name}</span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* <div className="p-4">
                <nav>
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.id} className={`${activeTab === item.id ? "bg-indigo-800" : "hover:bg-indigo-600"} rounded-md`}>
                                <Link
                                    href={getRouteUrl(item.route)}
                                    className={`flex items-center ${sidebarOpen ? "w-full px-4" : "justify-center"} py-2 rounded-md`}
                                    onClick={() => setActiveTab(item.id)}
                                >
                                    <item.icon size={20} />
                                    {sidebarOpen && (
                                        <span className="ml-3">{item.name}</span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div> */}

            {/* User Profile Footer */}
            {sidebarOpen && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-600">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                            <span className="font-bold">AU</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">
                                Admin User
                            </p>
                            <p className="text-xs text-indigo-300">
                                admin@umiya.com
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}