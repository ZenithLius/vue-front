/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Inter"', 'sans-serif'],
                display: ['"Outfit"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                skin: {
                    primary: 'rgb(var(--color-primary) / <alpha-value>)',
                    'primary-light': 'rgb(var(--color-primary-light) / <alpha-value>)',
                    'primary-dark': 'rgb(var(--color-primary-dark) / <alpha-value>)',
                    base: 'rgb(var(--color-text-main) / <alpha-value>)',
                    muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
                },
                bg: {
                    base: 'rgb(var(--color-bg-base) / <alpha-value>)',
                    card: 'rgb(var(--color-bg-card) / <alpha-value>)',
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
