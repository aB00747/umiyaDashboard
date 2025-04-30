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
    Menu,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

/**
 * Sidebar navigation items configuration.
 * Each item represents a single navigation link or a parent link with child items.
 * 
 * @typedef {Object} NavItem
 * @property {number} id - Unique identifier for the navigation item.
 * @property {string} key - Key used to identify the navigation item.
 * @property {string} name - Display name of the navigation item.
 * @property {React.Component} icon - Icon component to represent the navigation item.
 * @property {string} route - Route path associated with the navigation item.
 * @property {NavItem[]} [children] - Optional sub-items for parent navigation items.
 * 
 * @type {NavItem[]}
 */

export const navItems = [
    {
        id: 1,
        key: "dashboard",
        name: "Dashboard",
        icon: Home,
        route: "dashboard",
    },
    {
        id: 2,
        key: "customers",
        name: "Customers",
        icon: Users,
        route: "customers.index",
        // commented out for now
        // children: [
        //     {
        //         id: 1,
        //         key: "customers--info",
        //         name: "Customer Info",
        //         icon: null,
        //         route: "customers.index",
        //     },
        //     {
        //         id: 2,
        //         key: "customers--table",
        //         name: "Customer Table",
        //         icon: null,
        //         route: "customers.index",
        //     },
        // ],
    },
    {
        id: 3,
        key: "inventory",
        name: "Inventory",
        icon: Package,
        route: "inventory.index",
    },
    {
        id: 4,
        key: "orders",
        name: "Orders",
        icon: ShoppingCart,
        route: "orders.index",
    },
    {
        id: 5,
        key: "pricing",
        name: "Pricing",
        icon: Tag,
        route: "pricing.index",
    },
    {
        id: 6,
        key: "deliveries",
        name: "Deliveries",
        icon: Truck,
        route: "deliveries.index",
    },
    {
        id: 7,
        key: "messaging",
        name: "Messaging",
        icon: MessageSquare,
        route: "messaging.index",
    },
    {
        id: 8,
        key: "reports",
        name: "Reports",
        icon: BarChart2,
        route: "reports.index",
    },
    {
        id: 9,
        key: "documents",
        name: "Documents",
        icon: FileText,
        route: "documents.index",
    },
    {
        id: 10,
        key: "settings",
        name: "Settings",
        icon: Settings,
        route: "settings.index",
    },
];