<script setup>
import TheHeader from '../../components/the-header/TheHeader.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <TheHeader />
  <div class="no-room-container">
    <div class="message">
      존재하지 않거나 초대받지 않은 방입니다.
      <p>다시 시도하거나 홈으로 돌아가세요.</p>
    </div>
    <div class="button-container">
      <button @click="goHome" class="home-button">홈으로 돌아가기</button>
    </div>
  </div>
</template>

<style scoped>
.no-room-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fafafa;
  padding: 20px;
}

.message {
  font-size: 1.2rem;
  color: #555;
  text-align: center;
  background-color: #fff;
  padding: 25px 40px;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.message p {
  font-size: 1rem;
  color: #777;
  margin-top: 10px;
}

.button-container {
  margin-top: 20px;
}

.home-button {
  background-color: rgba(255, 255, 255, 0.7); /* 반투명 흰색 */
  color: black;
  padding: 15px 20px;
  font-family: '42dot Sans', serif;
  font-size: 1.3rem;
  font-weight: bold;
  border: 1px solid #6666662e; /* 테두리 색상 */
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1%;
  box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.2); /* 그림자 효과 */
}

.home-button:hover {
  background-color: rgba(255, 255, 255, 0.9); /* hover 시 배경색 변화 */
}
</style>
