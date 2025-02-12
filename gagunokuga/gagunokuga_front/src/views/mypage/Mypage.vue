<template>
  <div class="my-page">
    <!-- 사용자 정보 표시 -->
    <div class="content-wrapper">
      <div class="user-info">
        <img :src="profileImage" alt="Profile Image" class="profile-image"/>
      </div>
      <div class="mypage-info">
        <router-view></router-view>  <!-- 자식 컴포넌트를 여기 표시 -->
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed } from "vue";
import { useLoginStore } from "@/views/login/login";
import { useRouter } from "vue-router";
import axios from "axios";

const loginStore = useLoginStore();
const isLoggedIn = computed(() => !!loginStore.state.token);
const nickname = computed(() => loginStore.state.nickname);
const email = computed(() => loginStore.state.email);
const profileImage = computed(() => loginStore.state.profileImage || "@/assets/gagunokugaLogo.png");

const router = useRouter();
const baseURL = import.meta.env.VITE_API_URL;

// 프로필 수정 페이지로 이동
const goToProfileEdit = () => {
  router.push("/mypage/update");
};

// 정보 수정 페이지로 이동
const goToInfoEdit = () => {
  router.push("/mypage/update");
};

// 삭제 요청 보내기
const deleteAccount = async () => {
  try {
    await axios.delete(`${baseURL}/api/user/delete`, {
      headers: {
        Authorization: `Bearer ${loginStore.state.token}`,
      },
    });
    loginStore.logout();
    await router.push("/login");
  } catch (error) {
    console.error("삭제 중 오류 발생:", error);
  }
};
</script>
<style scoped>
@import "./mypage.css";
</style>