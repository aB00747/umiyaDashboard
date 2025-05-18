import { ArrowPathIcon, XCircleIcon } from "@heroicons/react/24/outline";

/**
 * Renders the footer section of the customer dialog with appropriate buttons
 * based on the current state and active tab.
 *
 * Props:
 * - handleUndo (function): Function to call when undoing a clear form action.
 * - handleClearForm (function): Function to call to clear the form fields.
 * - handleSubmit (function): Function to call to submit the form when in manual entry mode.
 * - activeTab (string): The currently active tab, which determines which buttons to show.
 * - showUndoTimer (boolean): Indicates if the undo timer is currently visible.
 * - undoTimeLeft (number): The remaining time left for the undo action in seconds.
 * - setIsModalOpen (function): Function to call to close the modal dialog.
 */

export default function DialogFooter({
    handleUndo,
    handleClearForm,
    handleSubmit,
    activeTab,
    showUndoTimer,
    undoTimeLeft,
    setIsModalOpen,
    isLoading,
    error,
}) {
    return (
        <div className="customer-dialog-footer">
            

            {showUndoTimer ? (
                <button
                    type="button"
                    className="customer-dialog-footer-button customer-dialog-footer-button-undo"
                    onClick={handleUndo}
                >
                    <ArrowPathIcon className="customer-dialog-footer-button-icon" />
                    <span>Undo Clear ({undoTimeLeft}s)</span>
                </button>
            ) : (
                <button
                    type="button"
                    className="customer-dialog-footer-button customer-dialog-footer-button-clear"
                    onClick={handleClearForm}
                >
                    <XCircleIcon className="customer-dialog-footer-button-icon" />
                    <span>Clear Form</span>
                </button>
            )}

            <div className="flex-grow"></div>

            <button
                type="button"
                className="customer-dialog-footer-button customer-dialog-footer-button-cancel"
                onClick={() => setIsModalOpen(false)}
            >
                Cancel
            </button>

            {activeTab === "manual" && (
                <button
                    type="submit"
                    className="customer-dialog-footer-button customer-dialog-footer-button-primary"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {/* Save Customer */}
                    {isLoading ? (
                        <span className="flex items-center">
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Saving...
                        </span>
                    ) : (
                        "Save Customer"
                    )}
                </button>
            )}

            {(activeTab === "excel" || activeTab === "pdf") && (
                <button
                    type="button"
                    className="customer-dialog-footer-button customer-dialog-footer-button-primary"
                    onClick={() => {
                        console.log("Processing import file...");
                        // Logic for processing the imported file
                    }}
                >
                    Process Import
                </button>
            )}
        </div>
    );
}
