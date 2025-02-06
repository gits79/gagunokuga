<template>
  <div class="login-container">
    <h1>로그인</h1>
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="email">이메일</label>
        <input type="email" id="email" v-model="email" placeholder="이메일을 입력하세요" required />
      </div>
      <div class="form-group">
        <label for="password">비밀번호</label>
        <input type="password" id="password" v-model="password" placeholder="비밀번호를 입력하세요" required />
      </div>
      <button class="basic-button" type="submit">로그인</button>
    </form>

    <!-- 이미지 버튼들 -->
    <div class="social-buttons">
      <img
          src="../../assets/login/kakaoLogin.png"
          alt="Kakao Login"
          @click="handleClick('카카오')"
          class="social-button"
      />
      <img
          src="../../assets/login/naverLogin.png"
          alt="Naver Login"
          @click="handleClick('네이버')"
          class="social-button"
      />
    </div>
  </div>
</template>

<script>
import axiosAddress from "../../axios/axiosAddress.js"; // axios import

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    // 로그인 처리
    onSubmit() {
      if (!this.email || !this.password) {
        alert('이메일과 비밀번호를 입력해주세요.');
        return;
      }

      // 로그인 요청
      const loginRequestDto = {
        email: this.email,
        password: this.password,
      };

      axiosAddress.post('/users/login', loginRequestDto)
          .then((response) => {
            // 로그인 성공 시 토큰을 로컬 스토리지에 저장
            const { token } = response.data;
            localStorage.setItem('authToken', token); // 토큰 저장

            alert('로그인 성공!');

            // 메인 페이지로 이동
            this.$router.push('/'); // 메인페이지 주소로 변경
          })
          .catch((error) => {
            console.error('로그인 실패:', error);
            alert('로그인에 실패했습니다. 다시 시도해주세요.');
          });
    },

    // 소셜 로그인 버튼 클릭
    handleClick(platform) {
      alert(`${platform} 로그인 버튼이 클릭되었습니다!`);
    },
  },
};
</script>

<style scoped>
.login-container {
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

/* 기본 로그인 버튼 */
.basic-button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.basic-button:hover {
  background-color: #0056b3;
}
</style>