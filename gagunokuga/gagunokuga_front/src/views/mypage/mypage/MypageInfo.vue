<template>
  <div class="info-container">
    <p class="nickname">{{ nickname }}</p>
    <p class="email">{{ email }}</p>

    <!-- 버튼들 -->
    <div class="action-buttons">
      <button @click="goToProfileEdit" class="edit-btn">프로필 수정</button>
      <button @click="goToInfoEdit" class="info-edit-btn">정보 수정</button>
      <button @click="deleteAccount" class="delete-btn">탈퇴</button>
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
    await axios.delete("/api/user/delete", {
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
.action-buttons {
  margin-top: 20px;  /* 버튼 간 간격 */
}
</style>
