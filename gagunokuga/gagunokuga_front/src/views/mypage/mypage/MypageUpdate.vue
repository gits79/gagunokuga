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
    // 취소 버튼 클릭 시 MypageInfo로 돌아가기
    cancelEdit() {
      this.$router.push('/mypage/info');
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
      <!-- 취소 버튼 추가 -->
      <button @click="cancelEdit" class="btn cancel">취소</button>
    </div>
  </div>
</template>

<style scoped>
@import "../mypage.css";

/* 취소 버튼 스타일 */
.cancel {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
}

.cancel:hover {
  background-color: #ddd;
}
</style>
