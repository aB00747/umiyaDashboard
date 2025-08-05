import React from "react";
import {
    UserIcon,
    CloudArrowUpIcon,
} from "@heroicons/react/24/outline";

/**
 * Simplified TabNavigation for Manual Entry and Unified Import
 *
 * Props:
 * - activeTab (string): The currently active tab ('manual' or 'import')
 * - setActiveTab (function): Function to call to set the active tab
 *
 * Returns:
 * - A rendered navigation element with two tabs
 */
export default function TabNavigation({ activeTab, setActiveTab }) {
    const tabs = [
        {
            id: 'manual',
            label: 'Manual Entry',
            icon: UserIcon,
            description: 'Add customer information manually'
        },
        {
            id: 'import',
            label: 'Import Files',
            icon: CloudArrowUpIcon,
            description: 'Import from Excel, CSV, or PDF files'
        }
    ];

    return (
        <nav className="customer-dialog-tabs" aria-label="Customer entry options">
            {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                    <button
                        key={tab.id}
                        type="button"
                        className={`customer-dialog-tabs-button ${
                            isActive
                                ? "customer-dialog-tabs-button-active"
                                : "customer-dialog-tabs-button-inactive"
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                        aria-selected={isActive}
                        title={tab.description}
                    >
                        <IconComponent className="customer-dialog-tabs-button-icon" />
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
