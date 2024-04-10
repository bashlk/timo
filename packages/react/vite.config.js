import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        visualizer({
            emitFile: true,
            template: 'sunburst'
        })
    ],
    server: {
        proxy: {
            '/api': {
                target: 'https://timer-app.frontendundefined.com/api',
                changeOrigin: true
            }
        }
    },
    base: '/react/'
});
