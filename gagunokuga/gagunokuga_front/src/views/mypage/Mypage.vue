<template>
  <div class="my-page">
    <!-- 사용자 정보 표시 -->
    <div class="user-info">
      <img :src="profileImage" alt="Profile Image" class="profile-image"/>
      <p class="nickname">{{ nickname }}</p>
      <p class="email">{{ email }}</p>
    </div>

    <!-- 수정 및 삭제 버튼 -->
    <div class="action-buttons">
      <button @click="goToEditPage" class="edit-btn">수정</button>
      <button @click="deleteAccount" class="delete-btn">삭제</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useLoginStore } from "@/views/login/login";  // 로그인 상태를 가져옵니다
import { useRouter } from "vue-router";  // 라우터 사용
import axios from "axios";  // axios 사용

// 로그인 상태 가져오기
const loginStore = useLoginStore();
const isLoggedIn = computed(() => !!loginStore.state.token);
const nickname = computed(() => loginStore.state.nickname);
const email = computed(() => loginStore.state.email); // email도 가져옵니다
const profileImage = computed(() => loginStore.state.profileImage || "@/assets/gagunokugaLogo.png");  // 기본 이미지

// 라우터 가져오기
const router = useRouter();

// 수정 페이지로 이동
const goToEditPage = () => {
  router.push("/edit-profile");  // '/edit-profile' 페이지로 이동
};

// 삭제 요청 보내기
const deleteAccount = async () => {
  try {
    // 삭제 API 호출
    await axios.delete("/api/user/delete", {
      headers: {
        Authorization: `Bearer ${loginStore.state.token}`,
      },
    });
    // 삭제 후 로그아웃 처리
    loginStore.logout(); // 로그아웃 처리
    router.push("/login"); // 로그인 페이지로 이동
  } catch (error) {
    console.error("삭제 중 오류 발생:", error);
  }
};
</script>

<style scoped>
@import "./mypage.css";
</style>
