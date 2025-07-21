import React from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

/**
 * Email input component for the login form.
 *
 * @param {{value: string, onChange: (field: string) => void, error: string}} props
 * @returns {JSX.Element} JSX element for the email input form field.
 */
export default function EmailInput({ value, onChange, error }) {
    return (
        <div>
            <InputLabel htmlFor="email" value="Email" />
            <TextInput
                id="email"
                type="email"
                name="email"
                value={value}
                className="mt-1 block w-full"
                autoComplete="username"
                isFocused
                onChange={onChange}
            />
            <InputError message={error} className="mt-2" />
        </div>
    );
}
