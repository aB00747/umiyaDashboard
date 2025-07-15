import React from "react";
import Requiredstar from "./forms/Requiredstar";

/**
 * A single form field component for the customer dialog form.
 *
 * @param {string} [type=text] - The type of form field to render.
 * @param {string} name - The name of the form field.
 * @param {string} label - The label for the form field.
 * @param {string} value - The current value of the form field.
 * @param {function} onChange - The function to call when the value of the form field changes.
 * @param {function} onBlur - The function to call when the form field is blurred.
 * @param {boolean} [required=false] - Whether the form field is required.
 * @param {string} error - The error message to display if the form field is invalid.
 * @param {boolean} touched - Whether the form field has been touched.
 * @param {string} className - Additional CSS classes to apply to the form field.
 * @param {ReactNode} children - An optional custom form element to render instead of a basic input.
 * @param {object} props - Additional props to pass to the rendered form element.
 */
const FormField = ({
    type = "text",
    name,
    label,
    value,
    onChange,
    onBlur,
    required = false,
    error,
    touched,
    className = "",
    children,
    ...props
}) => {
    const fieldId = `field-${name}`;
    const hasError = touched && error;

    const baseInputClass = `customer-dialog-field-input ${
        hasError ? "border-red-500 focus:border-red-500" : ""
    } ${className}`;

    const handleBlur = (e) => {
        if (onBlur) {
            onBlur(e);
        }
    };

    return (
        <div className="relative">
            <label htmlFor={fieldId} className="customer-dialog-field-label">
                {label}
                {required && <Requiredstar />}
            </label>

            {children ? (
                // For custom form elements like select
                React.cloneElement(children, {
                    id: fieldId,
                    name,
                    value: value || "",
                    onChange,
                    onBlur: handleBlur,
                    className: baseInputClass,
                    "aria-invalid": hasError,
                    "aria-describedby": hasError
                        ? `${fieldId}-error`
                        : undefined,
                    ...props,
                })
            ) : (
                <input
                    type={type}
                    id={fieldId}
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    onBlur={handleBlur}
                    className={baseInputClass}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${fieldId}-error` : undefined}
                    {...props}
                />
            )}

            {hasError && (
                <div
                    id={`${fieldId}-error`}
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                >
                    {error}
                </div>
            )}
        </div>
    );
};

export default FormField;
