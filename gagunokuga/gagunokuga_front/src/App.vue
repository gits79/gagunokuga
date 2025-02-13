<script setup>
import TheHeader from "@/components/the-header/TheHeader.vue";
import TheFooter from "@/components/the-footer/TheFooter.vue";
import Chat from "@/views/chat/Chat.vue";
import { useRoute } from 'vue-router';
import "@/styles/global.css";
import { useLoginStore } from "@/views/login/login";
import { ref, onMounted } from 'vue';
import axios from "axios";

const loginStore = useLoginStore();
// 조건에 따라 헤더 출현 여부 조정.(index.js)
const route = useRoute();

onMounted(() => {
  // 로컬스토리지에서 토큰을 확인하고 store 상태 복원
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  console.log('Tokens in localStorage:', { accessToken, refreshToken }); // 로그 추가


  if (accessToken) {
    loginStore.state.token = accessToken;
    if (refreshToken) {
      loginStore.state.refreshToken = refreshToken;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }
});
</script>

<template>
  <div class="app-container">
    <TheHeader v-if="route.meta.showHeader" />
    <div class="main-content">
      <router-view />
      <!-- 채팅 테스트용 -->
      <!-- <Chat /> -->
      
    </div>
    <TheFooter />
  </div>
</template>


<style scoped>
.app-container {
  position: relative;
  min-height: 100vh;
}

.main-content {
  display: flex;
  min-height: calc(100vh - 120px);
}

.chat-sidebar {
  position: fixed;
  right: 0;
  top: 80px;
  width: 300px;
  height: calc(100vh - 120px);
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  border-radius: 10px 0 0 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  background-color: #EF5C4E;
  color: white;
  border-radius: 10px 0 0 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: white;
}

.close-button:hover {
  opacity: 0.8;
}
</style>
