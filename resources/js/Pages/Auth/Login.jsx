import { useState, useCallback } from "react";
import { route } from "ziggy-js";
import { Head, Link, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import AuthService from "@/Services/auth/AuthService";
import {
    EmailInput,
    PasswordInput,
    RememberMe,
    StatusMessage,
    LoginErrorMessage
} from "@/Pages/Auth/fields";

/**
 * Renders a login form and handles the login process.
 *
 * The login form has fields for email and password, as well as a checkbox for
 * remembering the user. The form also includes a link to reset the password.
 *
 * The component accepts two props: `status` and `canResetPassword`.
 *
 * The `status` prop is a message to be displayed above the form, typically
 * indicating whether the user is already logged in or has been logged out.
 *
 * The `canResetPassword` prop is a boolean indicating whether the user can
 * reset their password. If true, a link to reset the password is displayed
 * below the form.
 */
export default function Login({ status, canResetPassword }) {
    const { data, setData, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [loginError, setLoginError] = useState("");

    const submit = useCallback(
        async (e) => {
            e.preventDefault();
            setLoginError("");

            try {
                // Call the AuthService login method
                await AuthService.login(data.email, data.password, data.remember);
                // If login is successful, AuthService will redirect to dashboard
            } catch (error) {
                setLoginError(
                    error.message ||
                        "Login failed. Please check your credentials."
                );
                reset("password");
            }
        },
        [data, reset]
    );

    const handleInputChange = useCallback(
        (field) => (e) => {
            const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

            setData(field, value);
            setLoginError(""); // Clear login error when input changes
        },
        [setData]
    );

    return (
        <GuestLayout>
            <Head title="Log in" />
            <StatusMessage isStatus={status} />
            <LoginErrorMessage error={loginError} />

            <form onSubmit={submit}>
                <EmailInput
                    value={data.email}
                    onChange={handleInputChange("email")}
                    error={errors.email}
                />

                <PasswordInput
                    value={data.password}
                    onChange={handleInputChange("password")}
                    error={errors.password}
                    showToggle
                />

                <RememberMe
                    value={data.remember}
                    onChange={handleInputChange("remember")}
                />

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
