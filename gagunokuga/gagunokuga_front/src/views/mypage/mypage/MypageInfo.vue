<template>
  <div class="info-container">
    <p class="nickname">{{ nickname }}</p>
    <p class="email">{{ email }}</p>

    <!-- 버튼들 -->
    <div class="action-buttons">
      <button @click="updateProfileImage" class="edit-btn">프로필 수정</button>
      <button @click="goToInfoEdit" class="info-edit-btn">정보 수정</button>
      <button @click="deleteUser" class="delete-btn">탈퇴</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useLoginStore } from "@/views/login/login";
import { useRouter } from "vue-router";
import axios from "axios";

const loginStore = useLoginStore();
const nickname = computed(() => loginStore.state.nickname);
const email = computed(() => loginStore.state.email);

const router = useRouter();
const baseURL = import.meta.env.VITE_API_URL;

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
  try {
    await axios.delete(`${baseURL}/api/users`, {
      headers: {
        Authorization: `Bearer ${loginStore.state.token}`,
      },
    });
    alert("계정이 삭제되었습니다.");
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
