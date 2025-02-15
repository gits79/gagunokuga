<template>
  <main class="content ">
    <!-- 두 번째 줄 (24개 박스) -->
    <RouterView />
  </main>
</template>

<script setup>
import { computed } from "vue";
import { useRouter, RouterView } from "vue-router";
import { useLoginStore } from "@/views/login/login";  // 로그인 상태를 가져옵니다

const router = useRouter();
const loginStore = useLoginStore();  // 로그인 상태 가져오기

// 로그인 상태 변수
const isLoggedIn = computed(() => !!loginStore.state.token);  // 로그인 상태 판단

function handleClick() {
  if (!isLoggedIn.value) {
    alert("로그인 후 이용해주세요.");
  } else {
    router.push("/room");
  }
}
</script>

<style scoped>
@import "./home.css";
</style>
