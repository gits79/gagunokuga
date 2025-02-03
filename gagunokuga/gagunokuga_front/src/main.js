import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 필요한 경우, 라우터도 설정

const app = createApp(App);
app.use(router); // 라우터 사용
app.mount('#app'); // #app에 Vue 앱 마운트