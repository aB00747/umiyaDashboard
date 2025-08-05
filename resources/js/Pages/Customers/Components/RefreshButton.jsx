/**
 * Renders a button to refresh the list of customers. The button is disabled
 * and shows a "Refreshing..." text when the list is being refreshed.
 *
 * @param {{ handleRefresh: Function, isLoading: boolean }} props
 * @property {Function} handleRefresh - Function to call to refresh the
 *                                      customers list.
 * @property {boolean} isLoading - Whether the customers list is currently
 *                                 being refreshed.
 * @returns {ReactElement} The rendered RefreshButton component.
 */
export default function RefreshButton({ handleRefresh, isLoading }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Customers</h2>
            <button
                onClick={handleRefresh}
                className="text-sm text-indigo-600 hover:text-indigo-900"
                disabled={isLoading}
            >
                {isLoading ? "Refreshing..." : "Refresh"}
            </button>
        </div>
    );
}
