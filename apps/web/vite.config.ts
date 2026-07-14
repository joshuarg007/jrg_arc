import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Bundle analysis - only in build mode
    mode === 'production' &&
      visualizer({
        filename: 'dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
  root: './apps/web',
  base: '/',
  server: {
    port: 5173,
    open: true,
    // Allow imports from the monorepo root (../../), e.g., packages/core/src
    fs: {
      allow: [path.resolve(__dirname, '../..')],
    },
    // SPA fallback for client-side routing
    historyApiFallback: true,
  },
  preview: {
    port: 4173,
  },
  // Ensure SPA routing works - all paths serve index.html
  appType: 'spa',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: mode !== 'production',
    minify: 'esbuild',
    target: 'esnext',
    rollupOptions: {
      output: {
        // Code splitting configuration
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-three': ['three', '@react-three/fiber'],
        },
        // Asset file naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, '../../packages/core/src'),
      '@ui': path.resolve(__dirname, '../../packages/ui/src'),
      '~': path.resolve(__dirname, './src'),
    },
  },
  // Environment variable prefix
  envPrefix: 'VITE_',
}));
