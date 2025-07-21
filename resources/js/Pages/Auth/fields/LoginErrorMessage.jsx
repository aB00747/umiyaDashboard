import React from "react";

/**
 * Display an error message when login fails.
 *
 * @param {{status: string}} props
 * @returns {JSX.Element} JSX element with an error message or null if no error
 */
export default function LoginErrorMessage({ error }) {
    return error ? (
        <div className="mb-4 text-sm font-medium text-red-600">{error}</div>
    ) : null;
}
