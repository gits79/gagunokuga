<script setup>
import { ref } from 'vue';
import axios from 'axios';

// 로그인 상태 관리
const email = ref('');
const password = ref('');
const isLoggedIn = ref(false);
const userNickname = ref('');
const userProfileImage = ref('');
const defaultImage = 'default-profile-image.png'; // 기본 이미지 경로

// 로그인 요청 함수
const handleLogin = async () => {
  try {
    // 백엔드로 로그인 요청 보내기
    const response = await axios.post('/api/users/login', {
      email: email.value,
      password: password.value,
    });

    // 로그인 성공 시 받은 토큰을 처리
    const { accessToken } = response.data;
    console.log('로그인 성공', accessToken);

    // 로그인 상태 업데이트 (여기서는 예시로 닉네임과 프로필 이미지를 설정)
    isLoggedIn.value = true;
    userNickname.value = '홍길동'; // 예시 닉네임
    userProfileImage.value = ''; // 프로필 이미지 (없으면 기본 이미지로 설정)
  } catch (error) {
    console.error('로그인 실패', error);
  }
};

// 카카오 로그인
const loginWithKakao = () => {
  Kakao.init('YOUR_KAKAO_JS_KEY');
  Kakao.Auth.login({
    success: function (authObj) {
      console.log('카카오 로그인 성공', authObj);
    },
    fail: function (error) {
      console.error('카카오 로그인 실패', error);
    }
  });
};

// 네이버 로그인
const loginWithNaver = () => {
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
};
</script>

<template>
  <div class="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg border-2 border-red-500">
    <form @submit.prevent="handleLogin" class="space-y-4">
      <!-- 이메일 입력 -->
      <div class="relative">
        <label
            for="email"
            class="absolute left-3 top-4 text-gray-500 text-base transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-sm peer-focus:text-red-700"
        >
        </label>
        <input
            type="email"
            id="email"
            v-model="email"
            placeholder="이메일"
            required
            class="peer w-full h-14 mt-1 p-4 bg-red-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <!-- 비밀번호 입력 -->
      <div class="relative">
        <label
            for="password"
            class="absolute left-3 top-4 text-gray-500 text-base transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-sm peer-focus:text-red-700"
        >
        </label>
        <input
            type="password"
            id="password"
            v-model="password"
            placeholder="비밀번호"
            required
            class="peer w-full h-14 mt-1 p-4 bg-red-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <!-- 로그인 버튼 및 소셜 로그인 버튼 (submit 내부) -->
      <div class="flex flex-col gap-2">
        <button
            type="submit"
            class="w-full h-12 bg-[#EF5C4E] text-white rounded-lg hover:bg-[#e24c3d] focus:outline-none focus:ring-2 focus:ring-[#EF5C4E]"
        >
          로그인
        </button>
        <button
            type="button"
            @click="loginWithKakao"
            class="w-full h-12 flex items-center justify-center bg-yellow-300 rounded-lg hover:opacity-80 focus:outline-none"
        >
          <img src="@/assets/login/kakaoLogin.png" alt="카카오 로그인" class="h-10" />
        </button>
        <button
            type="button"
            @click="loginWithNaver"
            class="w-full h-12 flex items-center justify-center bg-green-500 rounded-lg hover:opacity-80 focus:outline-none"
        >
          <img src="@/assets/login/naverLogin.png" alt="네이버 로그인" class="h-10" />
        </button>
      </div>
    </form>

    <!-- 비밀번호 찾기 및 회원가입 링크 -->
    <div class="text-center mt-4">
      <router-link to="/find-password" class="text-sm text-black-500 hover:underline">비밀번호 찾기</router-link>
      <span class="mx-2 text-sm text-gray-500">|</span>
      <router-link to="/signup" class="text-sm text-black-500 hover:underline">회원가입</router-link>
    </div>
  </div>
</template>
