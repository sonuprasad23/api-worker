/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                display: ['Syne', 'sans-serif'],
                mono: ['"IBM Plex Mono"', 'monospace'],
                body: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            colors: {
                base: '#050507',
                surface: 'rgba(255,255,255,0.04)',
                'surface-hover': 'rgba(255,255,255,0.07)',
                'border-dim': 'rgba(255,255,255,0.08)',
                indigo: {
                    DEFAULT: '#6366f1',
                    light: '#818cf8',
                    dark: '#4f46e5',
                    glow: 'rgba(99,102,241,0.2)',
                },
            },
            animation: {
                'shimmer': 'shimmer 2.5s linear infinite',
                'orb-pulse': 'orb-pulse 4s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'blink': 'blink 1s step-end infinite',
                'spin-slow': 'spin 8s linear infinite',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-200% center' },
                    '100%': { backgroundPosition: '200% center' },
                },
                'orb-pulse': {
                    '0%, 100%': { transform: 'scale(1)', opacity: '0.12' },
                    '50%': { transform: 'scale(1.15)', opacity: '0.18' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                },
            },
            backgroundImage: {
                'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(99,102,241,0.15), transparent)',
            },
        },
    },
    plugins: [],
};
