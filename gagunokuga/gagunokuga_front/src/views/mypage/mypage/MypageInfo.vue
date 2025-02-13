<template>
  <div class="info-container">
    <!-- 사용자 정보  -->
    <div class="profile-info">
      <h2 class="nickname">{{ nickname }}</h2>
      <p class="email">{{ email }}</p>
    </div>
 
     <!-- 버튼 그룹  -->
    <div class="action-buttons">
      <button @click="goToInfoEdit" class="blue-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
        정보 수정
      </button>
      
      <button @click="deleteUser" class="red-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
          <path d="M3 6h18"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
        탈퇴
      </button>
    </div>
  </div>
 </template>

<script setup>
import { computed, onMounted  } from "vue";
import { useLoginStore } from "@/views/login/login";
import { useRouter } from "vue-router";
import axios from "axios";

const loginStore = useLoginStore();
const router = useRouter();
const baseURL = import.meta.env.VITE_API_URL;

const nickname = computed(() => loginStore.state.nickname);
const email = computed(() => loginStore.state.email);


// // 컴포넌트 마운트 시 사용자 정보 가져오기
// onMounted(async () => {
//   // 토큰이 있는지 확인
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     loginStore.state.token = token;
//     await loginStore.fetchUserInfo();
//   } else {
//     router.push('/login');
//   }
// });

// 프로필 수정 페이지로 이동
const updateProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  try {
    const response = await axios.put(`${baseURL}/api/users/profile-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${loginStore.state.token}`,
      },
    });
    alert("프로필 이미지가 성공적으로 수정되었습니다.");
    // await loginStore.fetchUserInfo();
    loginStore.setUserInfo(response.data); // 사용자 정보 업데이트
  } catch (error) {
    console.error("프로필 이미지 수정 오류", error);
  }
};

// 정보 수정 페이지로 이동
const goToInfoEdit = () => {
  router.push("/mypage/update");
};

// 탈퇴 처리
const deleteUser = async () => {
  const isConfirmed = confirm("정말 탈퇴하시겠습니까? ");
  if (!isConfirmed) {
    return; 
  }

  try {
    await axios.delete(`${baseURL}/api/users`, {
      headers: {
        Authorization: `Bearer ${loginStore.state.token}`,
      },
    });
    alert("탈퇴되었습니다.");
    loginStore.logout();
    await router.push("/login");
  } catch (error) {
    console.error("계정 삭제 오류", error);
  }
};
</script>

<style scoped>
@import "../mypage.css";
</style>
