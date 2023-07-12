/** @type {import('tailwindcss').Config}*/
const config = {
    content: [
        "./src/**/*.{html,js,svelte,ts}",
        "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
    ],

    plugins: [
        require('flowbite/plugin')
    ],

    darkMode: 'class',

    theme: {
        extend: {
            colors: {
                // flowbite-svelte
                primary: { "50": "#fffbeb", "100": "#fef3c7", "200": "#fde68a", "300": "#fcd34d", "400": "#fbbf24", "500": "#f59e0b", "600": "#d97706", "700": "#b45309", "800": "#92400e", "900": "#78350f" }

            }
        }
    }
};

module.exports = config;