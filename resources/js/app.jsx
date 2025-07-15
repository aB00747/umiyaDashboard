import "../css/app.css";
import "../sass/app.scss";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

const appName = import.meta.env.VITE_APP_NAME || "UAC";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />

                {/* Toasts */}
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    gutter={8}
                    containerClassName=""
                    containerStyle={{}}
                    toastOptions={{
                        // Define default options
                        className: "",
                        duration: 4000,
                        style: {
                            background: "#363636",
                            color: "#fff",
                        },
                        // Default options for specific types
                        success: {
                            duration: 3000,
                            style: {
                                background: "#10b981",
                                color: "white",
                            },
                            iconTheme: {
                                primary: "white",
                                secondary: "#10b981",
                            },
                        },
                        error: {
                            duration: 4000,
                            style: {
                                background: "#ef4444",
                                color: "white",
                            },
                            iconTheme: {
                                primary: "white",
                                secondary: "#ef4444",
                            },
                        },
                        warning: {
                            duration: 3500,
                            style: {
                                background: "#f59e0b",
                                color: "white",
                            },
                        },
                        info: {
                            duration: 3000,
                            style: {
                                background: "#3b82f6",
                                color: "white",
                            },
                        },
                    }}
                />
            </>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
