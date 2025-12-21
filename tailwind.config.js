/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                // DYNAMIC SEMANTIC MAPPING
                slate: {
                    50: 'var(--text-1)',
                    100: 'var(--text-2)',
                    200: 'var(--text-2)',
                    300: 'var(--text-3)',
                    400: 'var(--text-4)',
                    500: 'var(--text-5)',
                    600: 'var(--border-bright)',
                    700: 'var(--border-dim)',
                    800: 'var(--bg-panel)',
                    850: 'var(--bg-sidebar)',
                    900: 'var(--bg-main)',
                    950: 'var(--bg-deep)',
                },
                // Blue Accents - Now Dynamic using RGB Channels for Opacity Support
                blue: {
                    400: 'rgb(var(--accent-400) / <alpha-value>)',
                    500: 'rgb(var(--accent-500) / <alpha-value>)',
                    600: 'rgb(var(--accent-600) / <alpha-value>)',
                    900: 'rgb(var(--accent-900) / <alpha-value>)',
                }
            }
        },
    },
    plugins: [],
}
