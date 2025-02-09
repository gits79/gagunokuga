
<script setup>
import { useLoginStore } from "@/views/login/login";  // 로그인 상태를 가져옵니다
import { computed } from "vue";

const loginStore = useLoginStore();  // 로그인 상태 초기화

// 로그인 상태에 따라 메뉴 항목을 동적으로 처리
const isLoggedIn = computed(() => !!loginStore.state.token);  // 로그인 상태 판단

// 로그아웃 처리
const logout = () => {
  loginStore.state.token = "";  // 토큰 초기화
  localStorage.removeItem("accessToken");  // 로컬 스토리지에서 토큰 제거
  localStorage.removeItem("refreshToken");
};
</script>

<template>
  <header>
    <nav>
      <ul>
        <li><router-link to="/">홈</router-link></li>

        <!-- 로그인 상태일 때 로그인/회원가입 숨기고, 로그아웃 보여주기 -->
        <li v-if="!isLoggedIn"><router-link to="/login">로그인</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/signup">회원가입</router-link></li>

        <!-- 로그인 상태일 때 로그아웃 버튼 표시 -->
        <li v-if="isLoggedIn" @click="logout"><router-link to="/login">로그아웃</router-link></li>

        <li><router-link to="/room-list">룸목록</router-link></li>
        <li><router-link to="/floor-plan-editor">도면에디터(임시)</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
@import "./TheHeader.css";
</style>
