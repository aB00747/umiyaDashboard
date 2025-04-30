import {
    Menu,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { navItems } from "../Constants/Layouts/Siderbar";

export default function Sidebar({
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
}) {
    // Track expanded menu items
    const [expandedItems, setExpandedItems] = useState({});

    // Expand parent items when child is active
    useEffect(() => {
        if (activeTab && activeTab.includes("--")) {
            const parentKey = activeTab.split("--")[0];
            setExpandedItems((prev) => ({
                ...prev,
                [parentKey]: true,
            }));
        }
    }, [activeTab]);

    const toggleExpand = (key) => {
        setExpandedItems((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const renderNavItem = (item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems[item.key];
        const isActive =
            activeTab === item.key ||
            (hasChildren &&
                item.children.some((child) => activeTab === child.key));

        return (
            <li
                key={item.id}
                className={`${
                    isActive ? "bg-indigo-800" : "hover:bg-indigo-600"
                } rounded-md ${hasChildren ? "flex flex-col" : ""}`}
            >
                <div className="flex w-full">
                    {hasChildren ? (
                        <button
                            onClick={() => toggleExpand(item.key)}
                            className={`flex items-center ${
                                sidebarOpen ? "w-full px-4" : "justify-center"
                            } py-2 rounded-md`}
                        >
                            <item.icon size={20} />
                            {sidebarOpen && (
                                <>
                                    <span className="ml-3">{item.name}</span>
                                    {isExpanded ? (
                                        <ChevronDown size={16} />
                                    ) : (
                                        <ChevronRight size={16} />
                                    )}
                                </>
                            )}
                        </button>
                    ) : (
                        <Link
                            href={route(item.route)}
                            onClick={() => setActiveTab(item.key)}
                            className={`flex items-center ${
                                sidebarOpen ? "w-full px-4" : "justify-center"
                            } py-2 rounded-md`}
                        >
                            <item.icon size={20} />
                            {sidebarOpen && (
                                <span className="ml-3">{item.name}</span>
                            )}
                        </Link>
                    )}
                </div>

                {/* Render children if expanded */}
                {hasChildren && isExpanded && sidebarOpen && (
                    <ul className="ml-6 mt-1 mb-1 space-y-1">
                        {item.children.map((child) => (
                            <li
                                key={child.id}
                                className={`${
                                    activeTab === child.key
                                        ? "bg-indigo-800"
                                        : "hover:bg-indigo-600"
                                } rounded-md`}
                            >
                                <Link
                                    href={route(child.route)}
                                    onClick={() => setActiveTab(child.key)}
                                    className="flex items-center px-4 py-2 rounded-md"
                                >
                                    {child.icon ? (
                                        <child.icon size={16} />
                                    ) : null}
                                    <span className="ml-3">{child.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        );
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
                    <ul className="space-y-2">{navItems.map(renderNavItem)}</ul>
                </nav>
            </div>

            {/* User Profile Footer */}
            {sidebarOpen && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-600">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                            <span className="font-bold">AU</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">Admin User</p>
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
