import React from "react";
import {
    UserIcon,
    TableCellsIcon,
    DocumentTextIcon,
} from "@heroicons/react/24/outline";

/**
 * TabNavigation
 *
 * A navigation bar for the customer dialog tabs.
 *
 * Props:
 * - activeTab (string): The currently active tab, which determines which button to highlight.
 * - setActiveTab (function): Function to call to set the active tab.
 *
 * Returns:
 * - A rendered element
 */
export default function TabNavigation({ activeTab, setActiveTab }) {
    return (
        <div className="customer-dialog-tabs">
            <button
                className={`customer-dialog-tabs-button ${
                    activeTab === "manual"
                        ? "customer-dialog-tabs-button-active"
                        : "customer-dialog-tabs-button-inactive"
                }`}
                onClick={() => setActiveTab("manual")}
            >
                <UserIcon className="customer-dialog-tabs-button-icon" />
                <span>Manual Entry</span>
            </button>
            <button
                className={`customer-dialog-tabs-button ${
                    activeTab === "excel"
                        ? "customer-dialog-tabs-button-active"
                        : "customer-dialog-tabs-button-inactive"
                }`}
                onClick={() => setActiveTab("excel")}
            >
                <TableCellsIcon className="customer-dialog-tabs-button-icon" />
                <span>Import Excel</span>
            </button>
            <button
                className={`customer-dialog-tabs-button ${
                    activeTab === "pdf"
                        ? "customer-dialog-tabs-button-active"
                        : "customer-dialog-tabs-button-inactive"
                }`}
                onClick={() => setActiveTab("pdf")}
            >
                <DocumentTextIcon className="customer-dialog-tabs-button-icon" />
                <span>Import PDF</span>
            </button>
        </div>
    );
}
