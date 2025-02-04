import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 외부 접속 허용
    port: 5173,      // 기본 포트 설정
  },
});