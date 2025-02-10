<script setup>
import { useLoginStore } from './login';  // 로그인 상태를 가져옵니다.

const loginStore = useLoginStore();  // 로그인 상태를 초기화
const handleKakaoLogin = () => {
  loginStore.kakaoLogin();
};
</script>

<template>
  <div class="login-container">
    <h2>로그인</h2>
    <form @submit.prevent="loginStore.login">
      <div class="form-group">
        <label for="email">이메일</label>
        <input v-model="loginStore.state.email" type="email" id="email" required placeholder="이메일을 입력하세요" />
      </div>
      <div class="form-group">
        <label for="password">비밀번호</label>
        <input v-model="loginStore.state.password" type="password" id="password" required placeholder="비밀번호를 입력하세요" />
      </div>
      <button type="submit">로그인</button>
    </form>
    <div class="kakao-login">
      <button @click.prevent="handleKakaoLogin">  <!-- prevent 추가 -->
        <img src="@/assets/login/kakaoLogin.png" alt="카카오 로그인" />
      </button>
    </div>
  </div>
</template>

<script>
import TheHeader from "@/components/the-header/TheHeader.vue";

export default {
  components: { TheHeader },
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    handleLogin() {
      console.log('로그인 시도', this.email, this.password);
    },

    loginWithNaver() {
      const naverLogin = new naver.LoginWithNaverId({
        clientId: 'YOUR_NAVER_CLIENT_ID',
        callbackUrl: 'YOUR_CALLBACK_URL',
        isPopup: true,
        loginButton: { color: "green", type: 1, height: 48 }
      });

      naverLogin.init();
      naverLogin.getLoginStatus(function (status) {
        if (status) {
          const accessToken = naverLogin.getAccessToken();
          console.log('네이버 로그인 성공', accessToken);
        } else {
          console.log('네이버 로그인 실패');
        }
      });
    },

    loginWithKakao() {
      Kakao.init('YOUR_KAKAO_JS_KEY');
      Kakao.Auth.login({
        success: function (authObj) {
          console.log('카카오 로그인 성공', authObj);
        },
        fail: function (error) {
          console.error('카카오 로그인 실패', error);
        }
      });
    }
  }
};
</script>
