import React from "react";
import Checkbox from "@/Components/Checkbox";

/**
 * "Remember me" checkbox component for the login form.
 *
 * @param {{value: boolean, onChange: (field: string) => void}} props
 * @returns {JSX.Element} JSX element for the "remember me" checkbox.
 */
export default function RememberMe({ value, onChange }) {
    return (
        <div className="mt-4 block">
            <label htmlFor="remember" className="flex items-center">
                <Checkbox
                    id="remember"
                    name="remember"
                    checked={value}
                    onChange={onChange}
                />
                <span className="ms-2 text-sm text-gray-600">Remember me</span>
            </label>
        </div>
    );
}
