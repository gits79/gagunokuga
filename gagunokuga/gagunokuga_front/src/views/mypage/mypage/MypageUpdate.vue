<script>
import { useMypageStore } from '../mypage.js';  // Pinia store 사용

export default {
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      isNicknameAvailable: null,
      nicknameError: ''
    };
  },
  computed: {
    // Pinia store에서 사용자 정보를 가져옵니다.
    user() {
      const userStore = useMypageStore();
      return userStore.state.user;
    }
  },
  async created() {
    const userStore = useMypageStore();  // Pinia store 인스턴스 호출
    try {
      await userStore.getUserInfo();  // 사용자 정보 가져오기
    } catch (error) {
      console.error(error.message);
    }
  },
  methods: {
    async checkNickname() {
      const userStore = useMypageStore();  // Pinia store 인스턴스 호출
      try {
        const isAvailable = await userStore.checkNicknameAvailability(this.user.nickname); // store 메서드 호출
        if (isAvailable) {
          this.isNicknameAvailable = true;
          this.nicknameError = '사용 가능한 닉네임입니다.';
        } else {
          this.isNicknameAvailable = false;
          this.nicknameError = '이미 사용 중인 닉네임입니다.';
        }
      } catch (error) {
        console.error(error.message);
        this.isNicknameAvailable = false;
        this.nicknameError = '닉네임 확인에 실패했습니다. 다시 시도해 주세요.';
      }
    },
    async updateUser() {
      if (this.isNicknameAvailable === false) {
        alert('닉네임을 먼저 확인해 주세요.');
        return;
      }

      if (this.newPassword && this.newPassword !== this.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      const updatedData = {
        nickname: this.user.nickname,
        password: this.newPassword ? this.newPassword : undefined
      };

      try {
        const userStore = useMypageStore();  // Pinia store 인스턴스 호출
        await userStore.updateUserInfo(updatedData);  // store 메서드 호출
        alert('수정되었습니다.');
      } catch (error) {
        console.error(error.message);
        alert('수정에 실패했습니다.');
      }
    },
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
      <input v-model="user.email" disabled class="input-box disabled" />

      <label>닉네임</label>
      <input v-model="user.nickname" class="input-box" />
      <button @click="checkNickname" class="btn">닉네임 중복 확인</button>
      <p v-if="nicknameError" class="error-message">{{ nicknameError }}</p>

      <label>새 비밀번호</label>
      <input v-model="newPassword" type="password" class="input-box" />

      <label>비밀번호 확인</label>
      <input v-model="confirmPassword" type="password" class="input-box" />

      <button @click="updateUser" class="btn">수정</button>
      <button @click="cancelEdit" class="btn cancel">취소</button>
    </div>
  </div>
</template>

<style scoped>
@import "../mypage.css";

.cancel {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
}

.cancel:hover {
  background-color: #ddd;
}

.error-message {
  color: red;
  font-size: 12px;
}
</style>
