import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'

// https://vite.dev/config/
export default defineConfig(() => {
  const baseUrl = process.env.BASE_URL || '/'
  return {
    plugins: [
      vue(),
      vueJsx(),
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
          /\.[tj]sx?$/, // 处理 .ts/.js
          /\.vue$/, // fallback，对 .vue 文件整体处理（某些 dev 情况）
          /\.vue\?vue/, // 关键！匹配 .vue 文件内部的脚本模块（如 lang.ts）
        ],
        imports: ['vue', 'vue-router'],
        dts: true,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    base: baseUrl,
  }
})
