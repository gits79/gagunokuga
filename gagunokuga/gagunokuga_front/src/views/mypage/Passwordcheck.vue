<template>
  <div class="container">
    <div class="box">
      <div class="icon-wrapper">
        <div class="icon-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
          viewBox="0 0 24 24" fill="none" stroke="currentColor" 
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </div>
      <h2>마이페이지</h2>
      <p class="subtitle">개인정보 보호를 위해 비밀번호를 한번 더 입력해주세요</p>
      <div class="input-wrapper">
        <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" 
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <input 
          v-model="password" 
          type="password" 
          placeholder="비밀번호를 입력하세요" 
          class="input-box" 
          @keyup.enter="checkPassword"
        >
      </div>
      <button @click="checkPassword" class="btn">확인</button>
      <p v-if="error" class="error">{{ error }}</p>
      <a href="#" class="forgot-password">비밀번호를 잊으셨나요?</a>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from "vue-router";
const baseURL = import.meta.env.VITE_API_URL;

export default {
  data() {
    return {
      password: '',
      error: ''
    };
  },
  methods: {
    async checkPassword() {
      try {
        await axios.post(`${baseURL}/api/users/pwd`, { password: this.password });
        this.$router.push('/mypage');
      } catch (err) {
        this.error = '비밀번호가 틀렸습니다.';
      }
    }
  }
};
</script>

<style scoped>
@import "./passwordcheck.css";
</style>