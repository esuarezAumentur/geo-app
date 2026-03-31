import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import cesium from 'vite-plugin-cesium'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    cesium(),
    VitePWA({ 
      registerType: 'autoUpdate',
      workbox: {
        // Aumentamos el límite a 6 MiB (o más si fuera necesario)
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024 
      },
      // Configuración mínima recomendada para que el manifest no esté vacío
      manifest: {
        name: 'Geo Editor PWA',
        short_name: 'GeoEditor',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png', // Asegúrate de tener estos iconos en /public o quita esta sección temporalmente
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    host: true, // expone en 0.0.0.0 para que Docker lo mapee
    port: 5173,
    watch: {
      usePolling: true, // necesario para detectar cambios en volúmenes Docker
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
