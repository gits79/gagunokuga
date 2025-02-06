<template>
  <div class="signup-container">
    <h1>회원가입</h1>
    <form @submit.prevent="onSubmit">
      <!-- 사용자 이름 -->
      <div class="form-group">
        <label for="nickname">닉네임</label>
        <input
            type="text"
            id="nickname"
            v-model="nickname"
            placeholder="닉네임을 입력하세요"
            required
        />
        <button type="button" @click="checkNickname" :disabled="isCheckingNickname">
          중복 확인
        </button>
        <span v-if="nicknameMessage" :class="nicknameValid ? 'valid' : 'invalid'">
          {{ nicknameMessage }}
        </span>
      </div>

      <!-- 이메일 -->
      <div class="form-group">
        <label for="email">이메일</label>
        <input
            type="email"
            id="email"
            v-model="email"
            placeholder="이메일을 입력하세요"
            required
        />
        <button type="button" @click="sendVerificationCode">인증번호 확인</button>
        <div v-if="showVerificationInput">
          <label for="verificationCode">인증번호</label>
          <input
              type="text"
              id="verificationCode"
              v-model="verificationCode"
              placeholder="인증번호를 입력하세요"
              required
          />
        </div>
      </div>

      <!-- 비밀번호 -->
      <div class="form-group">
        <label for="password">비밀번호</label>
        <input
            type="password"
            id="password"
            v-model="password"
            placeholder="비밀번호를 입력하세요"
            required
        />
      </div>

      <!-- 비밀번호 확인 -->
      <div class="form-group">
        <label for="confirmPassword">비밀번호 확인</label>
        <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="비밀번호를 다시 입력하세요"
            required
        />
      </div>

      <button type="submit">회원가입</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
      verificationCode: '',
      isCheckingNickname: false,
      showVerificationInput: false,
      nicknameValid: false,
      nicknameMessage: '',
    };
  },
  methods: {
    // 이메일 인증번호 보내기
    sendVerificationCode() {
      // 인증번호 발송 로직 (예: API 호출)
      alert(`이메일(${this.email})로 인증번호를 보냈습니다.`);
      this.showVerificationInput = true;
    },

    // 닉네임 중복 확인
    checkNickname() {
      if (!this.nickname) {
        this.nicknameMessage = '닉네임을 입력해주세요.';
        return;
      }
      this.isCheckingNickname = true;

      // 중복 확인 API 호출 (예시로 임시 딜레이 사용)
      setTimeout(() => {
        const isNicknameTaken = this.nickname === '이미있는닉네임'; // 예시
        this.nicknameValid = !isNicknameTaken;
        this.nicknameMessage = isNicknameTaken
            ? '이미 있는 닉네임입니다.'
            : '사용 가능한 닉네임입니다.';
        this.isCheckingNickname = false;
      }, 1000);
    },

    // 회원가입 폼 제출
    onSubmit() {
      // 비밀번호 일치 여부 확인
      if (this.password !== this.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      // 이메일 인증 여부 확인
      if (this.verificationCode !== '123456') {
        alert('인증번호가 틀렸습니다.');
        return;
      }

      // 회원가입 처리 로직 (예: API 요청)
      if (this.nickname && this.email && this.password) {
        alert(`회원가입 성공: ${this.nickname}, ${this.email}`);
        // 실제 로직 (예: Vuex, API 연동)
      } else {
        alert('모든 필드를 입력해주세요.');
      }
    },
  },
};
</script>

<style>
.signup-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
}

span {
  font-size: 14px;
  margin-left: 10px;
}

span.valid {
  color: green;
}

span.invalid {
  color: red;
}

div.form-group div {
  margin-top: 10px;
}

div.form-group input {
  width: calc(100% - 20px);
}
</style>
