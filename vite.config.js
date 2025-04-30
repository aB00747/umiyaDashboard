import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    css: {
        modules: {
            // Optional: Configure CSS modules if needed
            localsConvention: 'camelCase'
        }
    },
    plugins: [
        laravel({
            input: ['resources/sass/app.scss', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
});
