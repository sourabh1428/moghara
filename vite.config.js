import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: './', // For relative path resolution
  build: {
    outDir: 'dist', // Output directory
    // Additional build configurations can go here
  },
});
