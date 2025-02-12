// PasswordCheck.vue
<template>
  <div class="container">
    <div class="box">
      <h2>비밀번호 확인</h2>
      <input v-model="password" type="password" placeholder="비밀번호 입력" class="input-box">
      <button @click="checkPassword" class="btn">확인</button>
      <p v-if="error" class="error">{{ error }}</p>
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