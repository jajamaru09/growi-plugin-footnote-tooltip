import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'client-entry.tsx',
      formats: ['es'],
      fileName: 'client-entry',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
});
