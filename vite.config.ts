import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

const getHttpsConfig = () => {
  try {
    return {
      key: fs.readFileSync('./.certificates/localhost-key.pem'),
      cert: fs.readFileSync('./.certificates/localhost.pem'),
    }
  } catch (e) {
    return false
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    https: process.env.NODE_ENV === 'development' ? getHttpsConfig() : undefined,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));