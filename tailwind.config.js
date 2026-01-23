/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'bg-deep': '#050511',
                'bg-surface': '#0f1123',
                'primary': '#6366f1',
                'secondary': '#ec4899',
            },
            fontFamily: {
                'outfit': ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
