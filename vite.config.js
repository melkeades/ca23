import { defineConfig } from 'vite'
// import vitePugPlugin from 'vite-plugin-pug-transformer'
import pugPlugin from 'vite-plugin-pug'

const options = { localImports: true }

export default defineConfig({
  base: '',
  root: 'src',
  build: {
    outDir: '../dist',
  },
  server: {
    // host: true,
  },
  // plugins: [vitePugPlugin()],
  plugins: [pugPlugin(options)],
})
