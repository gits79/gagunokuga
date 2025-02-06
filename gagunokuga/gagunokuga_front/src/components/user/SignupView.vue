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
          닉네임 중복 확인
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
        <!-- 가로로 배치된 버튼들 -->
        <div class="button-group">
          <button type="button" @click="checkEmail">이메일 중복 확인</button>
          <button type="button" @click="sendVerificationCode">인증번호 확인</button>
        </div>
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
import axiosAddress from "../../axios/axiosAddress.js"

export default {
  data() {
    return {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
      verificationCode: '123456',
      isCheckingNickname: false,
      showVerificationInput: false,
      nicknameValid: false,
      nicknameMessage: '',
    };
  },
  methods: {
    // 이메일 중복 확인
    checkEmail() {
      if (!this.email) {
        alert('이메일을 입력해주세요.');
        return;
      }

      axiosAddress
          .get('/users/email', { params: { email: this.email } })
          .then((response) => {
            if (response.data.exists) {
              alert('이미 등록된 이메일입니다.');
            } else {
              alert('사용 가능한 이메일입니다.');
            }
          })
          .catch((error) => {
            console.error('이메일 중복 체크 실패:', error);
          });
    },

    // 닉네임 중복 확인
    checkNickname() {
      if (!this.nickname) {
        this.nicknameMessage = '닉네임을 입력해주세요.';
        return;
      }
      this.isCheckingNickname = true;
      console.log("닉네임 중복확인: ", this.nickname);
      axiosAddress
          .get('/users/nickname', { params: { nickname: this.nickname } })
          .then((response) => {
            console.log("서버 응답:", response); // 응답 객체 출력
            const { existing } = response.data; // 응답 데이터에서 'existing'을 추출
            console.log("existing:", existing); // 'existing' 값 출력
            this.nicknameValid = !existing; // 'existing' 값이 false이면 유효한 닉네임
            this.nicknameMessage = existing
                ? '이미 있는 닉네임입니다.'
                : '사용 가능한 닉네임입니다.';
          })
          .catch((error) => {
            console.error('닉네임 중복 체크 실패:', error);
          })
          .finally(() => {
            this.isCheckingNickname = false;
          });
    },

    // 이메일 인증번호 발송
    sendVerificationCode() {
      if (!this.email) {
        alert('이메일을 입력해주세요.');
        return;
      }

      axiosAddress
          .post('/users/email', null, { params: { email: this.email } })
          .then(() => {
            alert(`이메일(${this.email})로 인증번호를 보냈습니다.`);
            this.showVerificationInput = true;
          })
          .catch((error) => {
            console.error('이메일 발송 실패:', error);
          });
    },

    // 회원가입 폼 제출
    onSubmit() {
      if (this.password !== this.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      if (this.verificationCode !== '123456') {
        alert('인증번호가 틀렸습니다.');
        return;
      }

      const userRequestDto = {
        nickname: this.nickname,
        email: this.email,
        password: this.password,
        verificationCode: this.verificationCode,
      };
      console.log(userRequestDto);

      axiosAddress
          .post('/users', userRequestDto)
          .then(() => {
            alert('회원가입 성공');
            // 로그인 화면으로 리다이렉트
            this.$router.push('/login');
          })
          .catch((error) => {
            console.error('회원가입 실패:', error);
            alert('회원가입에 실패했습니다.');
          });
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

/* 가로로 배치된 버튼 스타일 */
.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.button-group button {
  flex: 1; /* 버튼을 동일 크기로 배치 */
}
</style>
