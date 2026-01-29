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
                // Slate/Zinc Dark Mode palette
                background: {
                    DEFAULT: '#0f172a', // slate-900
                    card: '#1e293b',    // slate-800
                    hover: '#334155',   // slate-700
                },
                foreground: {
                    DEFAULT: '#f1f5f9', // slate-100
                    muted: '#94a3b8',   // slate-400
                },
                accent: {
                    DEFAULT: '#3b82f6', // blue-500
                    hover: '#2563eb',   // blue-600
                    glow: 'rgba(59, 130, 246, 0.5)',
                },
                success: '#22c55e',   // green-500
                warning: '#f59e0b',   // amber-500
                danger: '#ef4444',    // red-500
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Menlo', 'monospace'],
            },
            boxShadow: {
                'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
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
                    '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
                    '50%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' },
                },
            },
        },
    },
    plugins: [],
}
