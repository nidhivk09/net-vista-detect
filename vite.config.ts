import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from 'path';
// 🚨 ADD THIS LINE: Explicitly import the function from its package
import { componentTagger } from "lovable-tagger";


const projectRoot = process.cwd();

export default defineConfig(({ mode }) => ({

  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },

  // Now componentTagger is defined because it was imported above
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "./src"),
    },
  },
}));