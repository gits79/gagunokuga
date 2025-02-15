<template>
  <div class="my-page">
    <!-- 사용자 정보 표시 -->
    <div class="content-wrapper">
      <div class="profile-changer">
        <div class="user-info">
          <img :src="profileImage" alt="Profile Image" class="profile-image"/>
        </div>
        <!-- 버튼을 label로 감싸서 file input과 연결 -->
        <label class="blue-btn" style="cursor: pointer;">
          <input 
            type="file"
            @change="handleFileChange"
            accept="image/*"
            style="display: none"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          프로필 수정
        </label>
      </div>
      <div class="mypage-info">
        <router-view></router-view>  <!-- 자식 컴포넌트를 여기 표시 -->
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed, ref } from "vue";
import { useLoginStore } from "@/views/login/login";
import { useRouter } from "vue-router";
import axios from "axios";
import { useMypageStore } from "./mypage";

const loginStore = useLoginStore();
const mypageStore = useMypageStore();
// const fileInput = ref(null);
// const isLoggedIn = computed(() => !!loginStore.state.token);
// const nickname = computed(() => loginStore.state.nickname);
// const email = computed(() => loginStore.state.email);
const profileImage = computed(() => loginStore.state.profileImage || "@/assets/gagunokugaLogo.png");
const router = useRouter();
const baseURL = import.meta.env.VITE_API_URL;


// 파일 변경 핸들러
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 파일 유효성 검사
  if (!file.type.startsWith('image/')) {
    alert('이미지 파일만 업로드 가능합니다.');
    return;
  }

  // 파일 크기 제한 (예: 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    alert('파일 크기는 5MB 이하여야 합니다.');
    return;
  }

  const formData = new FormData();
  formData.append("profileImage", file);

  try {
    await axios.put(`${baseURL}/api/users/profile-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${loginStore.state.token}`,
      },
    });
    
    await loginStore.fetchUserInfo();
    // await mypageStore.getUserInfo();
    
    alert("프로필 이미지가 성공적으로 수정되었습니다.");
  } catch (error) {
    console.error("프로필 이미지 수정 오류", error);
    alert("프로필 이미지 수정에 실패했습니다.");
  }
  
  // input 초기화
  event.target.value = '';
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