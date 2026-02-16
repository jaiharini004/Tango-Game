export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#FCFBF8',
                'grid-line': '#EBE3D5',
                locked: '#F1EBE0',
                sun: '#F7A028',
                moon: '#316FCF',
            },
            borderRadius: {
                'pill': '9999px',
            }
        },
    },
    plugins: [],
}
