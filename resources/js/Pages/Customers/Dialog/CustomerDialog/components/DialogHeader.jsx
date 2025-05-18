import { XMarkIcon } from "@heroicons/react/24/outline";

/**
 * A component for the header of the customer dialog.
 *
 * @param {function} setIsModalOpen - A function to set the open state of the modal.
 * @returns {React.ReactElement} A React component representing the header of the customer dialog.
 */
export default function DialgoHeader({ setIsModalOpen }) {
    return (
        <>
            <div className="customer-dialog-header">
                <h3 className="customer-dialog-header-title">
                    Add New Customer
                </h3>
                <button
                    type="button"
                    className="customer-dialog-header-close-button"
                    onClick={() => setIsModalOpen(false)}
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>
        </>
    );
}
