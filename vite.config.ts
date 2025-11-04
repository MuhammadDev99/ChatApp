// vite.config.js
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
    plugins: [
        react({
            babel: {
                // The plugin should be a simple string in the array
                plugins: ["module:@preact/signals-react-transform"],
            },
        }),
    ],
    base: "/ChatApp/",
})
