/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Space Grotesk"', 'sans-serif'],
                heading: ['"Chakra Petch"', 'sans-serif'],
            },
            colors: {
                impeccable: {
                    bg: '#0c0c0a',
                    surface: '#161613',
                    cream: '#f4ede2',
                    orange: '#e05320',
                    amber: '#ffb800',
                    muted: '#8e8a82'
                }
            }
        },
    },
    plugins: [],
}
