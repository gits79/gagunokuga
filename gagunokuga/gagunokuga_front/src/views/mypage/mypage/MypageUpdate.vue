<template>
  <div class="update-container">
    <div v-if="user" class="form-box">
      <label>이메일</label>
      <input v-model="user.email" disabled class="input-box disabled" />

      <label>닉네임</label>
      <input v-model="user.nickname" class="input-box" />
      <p v-if="user.nickname.length >= 16" class="error-message">
        닉네임은 최대 16자까지 입력 가능합니다.
      </p>
      <div class="check-nickname">
        <button @click="checkNickname" class="blue-btn">닉네임 중복 확인</button>
        <p v-if="nicknameError" class="error-message">{{ nicknameError }}</p>
      </div>
      <label>새 비밀번호</label>
      <input v-model="newPassword" type="password" class="input-box" />

      <label>비밀번호 확인</label>
      <input v-model="confirmPassword" type="password" class="input-box" />

      <div class="btn-box">
        <button @click="updateUser" class="blue-btn">수정</button>
        <button @click="cancelEdit" class="red-btn">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import { watch } from "vue";
import { useMypageStore } from '../mypage.js';  // Pinia store 사용
import { useLoginStore } from '../../login/login.js';

export default {
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      isNicknameAvailable: null,
      nicknameError: '',
      originalNickname:''
    };
  },
  computed: {
    user() {
      const userStore = useMypageStore();
      return userStore.state.user;
    },
    isNicknameChanged() {
      return this.originalNickname !== this.user.nickname;
    }
  },
  async created() {
    const userStore = useMypageStore();  // Pinia store 인스턴스 호출
    try {
      await userStore.getUserInfo();  // 사용자 정보 가져오기
      this.originalNickname = userStore.state.user.nickname;
    } catch (error) {
      console.error(error.message);
    }
  },
  watch: {
    "user.nickname"(newVal) {
      if (newVal.length > 16) {
        this.user.nickname = newVal.slice(0, 16); // 16자로 자동 자르기
      }
    }
  },
  methods: {
    async checkNickname() {
      const userStore = useMypageStore();
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
      // 닉네임이 변경되었고, 중복 확인을 하지 않은 경우에만 체크
      if (this.isNicknameChanged && this.isNicknameAvailable !== true) {
        alert('변경된 닉네임을 먼저 확인해 주세요.');
        return;
      }

      if (this.newPassword && this.newPassword !== this.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      const updatedData = {

      };
       // 닉네임이 변경된 경우에만 nickname 포함
    if (this.isNicknameChanged) {
        updatedData.nickname = this.user.nickname;
    }

    // 비밀번호가 입력된 경우에만 password 포함
    if (this.newPassword) {
        updatedData.password = this.newPassword;
    }

      try {
        const userStore = useMypageStore();
        const loginStore = useLoginStore(); // 여기서 store 호출

        await userStore.updateUserInfo(updatedData);

        await loginStore.fetchUserInfo(); // ✅ fetchUserInfo 호출해서 새 정보 반영

        alert('수정되었습니다.');
        this.$router.push('/mypage/info');
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

<style scoped>
@import "../mypage.css";
</style>
