<script setup>
import { useLoginStore } from "@/views/login/login";  // 로그인 상태를 가져옵니다
import { computed, watchEffect } from "vue";
// 이미지 경로를 import로 불러오기
import defaultProfileImage from "@/assets/gagunokugaLogo.png";  // 기본 이미지 경로

const loginStore = useLoginStore();  // 로그인 상태 초기화

// 로그인 상태에 따라 메뉴 항목을 동적으로 처리
const isLoggedIn = computed(() => !!loginStore.state.token);  // 로그인 상태 판단
const nickname = computed(() => loginStore.state.nickname);
const profileImage = computed(() => loginStore.state.profileImage || defaultProfileImage);
const isProvided = computed(() => !!loginStore.state.provider);  // provider가 null일 경우 false로 변환

// 페이지 로드 시 사용자 정보 불러오기
watchEffect(() => {
  if (isLoggedIn.value) {
    loginStore.fetchUserInfo();
  }
});

// 로그아웃 처리
const logout = () => {
  loginStore.state.token = "";  // 토큰 초기화
  localStorage.removeItem("accessToken");  // 로컬 스토리지에서 토큰 제거
  localStorage.removeItem("refreshToken");
  loginStore.state.nickname = ""; // 닉네임 초기화
  loginStore.state.profileImage = ""; // 프로필 초기화
  loginStore.state.password = ""; // 비밀번호 초기화
  loginStore.state.provider = ""; // 이것도 초기화
};
</script>

<template>
  <header>
    <router-link to="/" class="logo-link">
      <img class="logo" src="@/assets/gagunokuga_logo_logo.svg" alt="가구놓구가" />
    </router-link>
    <nav>
      <ul>
        <template v-if="isLoggedIn">
          <li class="profile">
            <img :src="profileImage" alt="프로필 이미지" class="profile-img" />
            <span class="nickname">{{ nickname }}</span>
          </li>
        </template>

        <li><router-link to="/">홈</router-link></li>

        <!-- 로그인 상태일 때 로그인/회원가입 숨기고, 로그아웃 보여주기 -->
        <li v-if="!isLoggedIn"><router-link to="/login">로그인</router-link></li>

        <!-- 로그인 상태일 때 버튼 표시 -->

        <li v-if="isLoggedIn" @click="logout"><router-link to="/login">로그아웃</router-link></li>
        <li v-if="isLoggedIn && !isProvided"><router-link to="/pwdcheck">마이페이지</router-link></li>
        <li v-if="isLoggedIn"><router-link to="/room">마이홈</router-link></li>

      </ul>
    </nav>
  </header>
</template>

<style scoped>
@import "./theHeader.css";

</style>
