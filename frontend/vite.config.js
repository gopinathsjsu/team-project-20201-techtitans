import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/restaurants": "http://localhost:5000",
			"/users": "http://localhost:5000",
			"/log-in": "http://localhost:5000",
			"/reservations": "http://localhost:5000",
			"/reviews": "http://localhost:5000",
			"/gallery": "http://localhost:5000",
		},
	},
});
