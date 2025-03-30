import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import fs from "fs";
import path from "path";


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "../server/server.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "../server/server.cert")),
        },
        host: "localhost",
        port: 5173,
        hmr: {
          protocol: "wss", // Use Secure WebSockets (wss://)
          host: "localhost",
        }
  },
});