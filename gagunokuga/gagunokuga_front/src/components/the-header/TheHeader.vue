<script setup>
import { useLoginStore } from "@/views/login/login";  // 로그인 상태를 가져옵니다
import { computed, watchEffect } from "vue";
import { useRoute } from "vue-router";  // 현재 라우터 정보를 가져오기 위한 useRoute 추가

const loginStore = useLoginStore();  // 로그인 상태 초기화
const route = useRoute();  // 현재 라우터 정보 가져오기

// 현재 경로가 "article"인지 확인
const isArticlePage = computed(() => route.path.includes('/article'));

// 로그인 상태에 따라 메뉴 항목을 동적으로 처리
const isLoggedIn = computed(() => !!loginStore.state.token);  // 로그인 상태 판단
const nickname = computed(() => loginStore.state.nickname);
const profileImage = computed(() => loginStore.state.profileImage);
const isProvided = computed(() => !!loginStore.state.provider);  // provider가 null일 경우 false로 변환

// 페이지 로드 시 사용자 정보 불러오기
watchEffect(() => {
  if (isLoggedIn.value) {
    loginStore.fetchUserInfo();
  }
});

// 로그아웃 처리
const logout = () => {
  loginStore.logout();  // loginStore의 logout 메서드 호출
};
</script>

<template>
  <header>
    <router-link to="/" class="logo-link">
      <img class="logo" src="@/assets/gagunokuga_logo_logo.svg" alt="가구놓구가" />
    </router-link>
    <nav>
      <ul>
        <li v-if="isLoggedIn && isArticlePage">
          <router-link to="/article/create" class="create-button">
            글쓰기
          </router-link>
        </li>
        <li>
          <router-link to="/article" class="article-link">
            커뮤니티
          </router-link>
        </li>
        <template v-if="isLoggedIn">
          <li class="profile">
            <img :src="profileImage" alt="프로필 이미지" class="profile-img" />
            <span class="nickname">👋 안녕하세요, {{ nickname }} 님!</span>
          </li>
        </template>

        <!-- 로그인 상태일 때 로그인/회원가입 숨기고, 로그아웃 보여주기 -->
        <li v-if="!isLoggedIn"><router-link to="/login">로그인</router-link></li>

        <!-- 로그인 상태일 때 버튼 표시 -->
        <li v-if="isLoggedIn && !isProvided"><router-link to="/pwdcheck">마이페이지</router-link></li>
        <li v-if="isLoggedIn" class="my-home"><router-link to="/room">마이홈</router-link></li>
        <li v-if="isLoggedIn" @click="logout"><router-link to="/login">로그아웃</router-link></li>

      </ul>
    </nav>
  </header>
</template>

<style scoped>
@import "./theHeader.css";

</style>
