import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Components({
      dirs: ['./src/Layout/page-layout'],
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
    AutoImport({
      include: [
        /\.vue$/,
        /\.vue\.[tj]sx?\?vue/
      ],
      imports: [
        'vue',
        'vue-router',
      ],
      dts: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
