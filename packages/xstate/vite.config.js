import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode}) => {
    const env = loadEnv(mode, process.cwd());
    return {
        plugins: [
            react(),
            visualizer({
                emitFile: true
            })
        ],
        server: {
            proxy: {
                '/api': {
                    target: 'https://timo.frontendundefined.com/api',
                    changeOrigin: true
                }
            }
        },
        base: env.VITE_BASE_URL
    };
});
