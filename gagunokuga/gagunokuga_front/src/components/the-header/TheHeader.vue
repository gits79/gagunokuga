<script setup>
import { useRoomListStore } from "../../views/room/roomStore";
import { useLoginStore } from "@/views/login/login";  // 로그인 상태를 가져옵니다
import { computed, watchEffect, ref } from "vue";
import { useRouter } from "vue-router";
import CreateRoomModal from "../../views/room/CreateRoomModal.vue";

const loginStore = useLoginStore();  // 로그인 상태 초기화
const roomStore = useRoomListStore();
const router = useRouter();
const isModalOpen = ref(false); 

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


const showCreateRoomModal = () => {
  if (!isLoggedIn.value) {
    router.push({ name: 'Login' }); 
  } else {
    isModalOpen.value = true; 
  }
};

const createRoom = async (roomName) => {
  const roomData = await roomStore.createRoom(roomName);
  if (roomData && roomData.roomId) {
    isModalOpen.value = false;
    router.push({ name: 'Editor', params: { roomId: roomData.roomId } });
  }
};


const handleMyRoom = async () => {
  if (!isLoggedIn.value) {
    router.push({ name: 'Login' });
  } else {
    router.push({ name: 'Room' });
  }
}
</script>

<template>
  <header>
    <!-- 왼쪽: 로고 -->
    <div class="left-nav">
      <router-link to="/" class="logo-link">
        <img class="logo" src="@/assets/gagunokuga_logo_logo.svg" alt="가구놓구가" />
      </router-link>
    </div>

    <!-- 가운데: 메뉴(커뮤니티 & 마이홈) -->
    <nav class="center-nav">
      <ul>
        <li><router-link to="/article">커뮤니티</router-link></li>
        <li><a @click="showCreateRoomModal">홈 만들기</a></li>
        <li><a @click="handleMyRoom">마이홈</a></li>
        <li v-if="isLoggedIn && !isProvided"><router-link to="/pwdcheck">마이페이지</router-link></li>
      </ul>
    </nav>

    <!-- 오른쪽: 로그인 관련 메뉴 -->
    <nav class="right-nav">
      <ul>
        <template v-if="isLoggedIn">
          <li class="profile">
            <img :src="profileImage" alt="프로필 이미지" class="profile-img" />
            <span class="nickname">👋 안녕하세요, {{ nickname }} 님!</span>
          </li>
        </template>

        <li v-if="!isLoggedIn"><router-link to="/login">로그인</router-link></li>
        <li v-if="isLoggedIn" @click="logout" class="logout"><router-link to="/login">로그아웃</router-link></li>
      </ul>
    </nav>

    <!-- 방 생성 모달 -->
    <CreateRoomModal v-if="isModalOpen" @close="isModalOpen = false" @create="createRoom" />
  </header>
</template>

<style scoped>
@import "./theHeader.css";
</style>