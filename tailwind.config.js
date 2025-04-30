import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    DEFAULT: '#4f46e5',
                    light: '#6366f1',
                    dark: '#4338ca',
                },
                secondary: {
                    DEFAULT: '#059669',
                    light: '#10b981',
                    dark: '#047857',
                },
                danger: '#dc2626',
                warning: '#d97706',
                success: '#16a34a',
            },
        },
    },

    plugins: [forms],
};
