import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Web-Course-Frontend/',  // 设置为你的仓库名称
  plugins: [react()],
})
