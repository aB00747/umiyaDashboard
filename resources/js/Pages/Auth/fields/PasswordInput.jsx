import { useState, useCallback } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

/**
 * Renders a password input field with an optional toggle to show/hide the password.
 *
 * @param {string} [label="Password"] - The label for the input field.
 * @param {boolean} [showToggle=false] - Whether to show a toggle to show/hide the password.
 * @param {string} value - The current value of the input field.
 * @param {function} onChange - The function to call when the value of the input field changes.
 * @param {string} error - The error message to display if the input field is invalid.
 *
 * @returns {JSX.Element} JSX element for the password input field.
 */
export default function PasswordInput({
    value,
    onChange,
    error,
    label = "Password",
    showToggle = false,
}) {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    return (
        <div className="mt-4">
            <InputLabel htmlFor="password" value={label} />
            <div className="relative">
                <TextInput
                    id="password"
                    type={showToggle && showPassword ? "text" : "password"}
                    name="password"
                    value={value}
                    className="mt-1 block w-full pr-10"
                    autoComplete="current-password"
                    onChange={onChange}
                />
                {showToggle && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={handleTogglePassword}
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                    </button>
                )}
            </div>
            <InputError message={error} className="mt-2" />
        </div>
    );
}
