/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Black + Gold palette
                background: {
                    DEFAULT: '#070707', // deep black
                    card: '#12100c',    // warm near-black
                    hover: '#1a1510',   // elevated panel
                },
                foreground: {
                    DEFAULT: '#f8e7bf', // warm light gold
                    muted: '#c7a85a',   // muted gold
                },
                accent: {
                    DEFAULT: '#d4a93a', // gold
                    hover: '#e0bd64',   // bright gold
                    glow: 'rgba(212, 169, 58, 0.5)',
                },
                success: '#d4a93a',
                warning: '#eab308',
                danger: '#ef4444',    // red-500
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Menlo', 'monospace'],
            },
            boxShadow: {
                'glow': '0 0 20px rgba(212, 169, 58, 0.35)',
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(212, 169, 58, 0.35)' },
                    '50%': { boxShadow: '0 0 30px rgba(212, 169, 58, 0.65)' },
                },
            },
        },
    },
    plugins: [],
}
