import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import postcssPresetEnv from 'postcss-preset-env'
import tailwindcss from 'tailwindcss'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const pathResolve = (path: string): string => resolve(process.cwd(), path)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver()],
      dts: pathResolve('auto-imports.d.ts')
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: pathResolve('components.d.ts')
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 配置全局sass变量注入
        additionalData: '@import "@/styles/variable.scss";'
      }
    },
    postcss: {
      plugins: [tailwindcss(), postcssPresetEnv()]
    }
  }
})
