<script>
import axios from 'axios';
export default {
  data() {
    return {
      user: null
    };
  },
  async created() {
    const res = await axios.get('/api/users');
    this.user = res.data;
  },
  methods: {
    async updateUser() {
      await axios.put('/api/users', { nickname: this.user.nickname });
      alert('수정되었습니다.');
    },
    async deleteUser() {
      if (confirm('정말 탈퇴하시겠습니까?')) {
        await axios.delete('/api/users');
        alert('탈퇴되었습니다.');
        this.$router.push('/');
      }
    }
  }
};
</script>

<template>
  <div class="container">
    <h2>마이페이지</h2>
    <div v-if="user" class="form-box">
      <label>이메일</label>
      <input v-model="user.email" disabled class="input-box disabled">
      <label>닉네임</label>
      <input v-model="user.nickname" class="input-box">
      <button @click="updateUser" class="btn">수정</button>
      <button @click="deleteUser" class="btn delete">탈퇴</button>
    </div>
  </div>
</template>

<style scoped>
@import "./mypage.css";
</style>
