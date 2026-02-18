import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) return undefined;
                    const path = id.split('node_modules/')[1];
                    if (!path) return undefined;
                    const packageName = path.startsWith('@')
                        ? path.split('/').slice(0, 2).join('/')
                        : path.split('/')[0];
                    return `vendor-${packageName.replace('@', '').replace('/', '-')}`;
                },
            },
        },
    },
})
