/**
 * Checkbox component that renders a styled checkbox input element.
 *
 * @param {Object} props - The props for the checkbox component.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the checkbox.
 * @returns {JSX.Element} The rendered checkbox input element.
 */
export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                `rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 ${className}`
            }
        />
    );
}
