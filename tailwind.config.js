/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'retro-bg': 'var(--retro-bg)',
                'retro-primary': 'var(--retro-primary)',
                'retro-green': '#00ff41',
                'retro-amber': '#ffb000',
                'retro-red': '#ff0033',
                'retro-blue': '#00f0ff',
            },
            fontFamily: {
                'retro': ['"VT323"', 'monospace'],
                'pixel': ['"Press Start 2P"', 'cursive'],
            },
            animation: {
                'flicker': 'flicker 0.15s infinite',
                'scanline': 'scanline 8s linear infinite',
            },
            keyframes: {
                flicker: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.98' },
                },
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                }
            }
        },
    },
    plugins: [],
}
