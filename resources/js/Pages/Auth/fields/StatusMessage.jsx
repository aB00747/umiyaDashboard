/**
 * Displays a status message if provided.
 *
 * @param {Object} props - The component props.
 * @param {string} props.isStatus - The status message to display. If not provided, nothing is rendered.
 * @returns {JSX.Element|null} A div containing the status message or null if no message is provided.
 */
export default function StatusMessage({ isStatus }) {
    return isStatus ? (
        <div className="mb-4 text-sm font-medium text-green-600">
            {isStatus}
        </div>
    ) : null;
}
