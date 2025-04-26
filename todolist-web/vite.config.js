import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  define: {
    // eslint-disable-next-line no-undef
    'process.env': process.env
  },
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }
})
