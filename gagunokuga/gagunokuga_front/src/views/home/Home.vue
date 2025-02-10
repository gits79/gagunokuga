<template>
  <main class="content ">
    <!-- 첫 번째 줄 (2개 정사각형 박스) -->
    <div class="row">
      <div class="box"></div>
      <router-link to="/floor-plan-editor" class="box2">
        <img class="logo" src="@/assets/gagunokuga_logo_link.svg" alt="도면에디터 바로가기" />
      </router-link>
    </div>

    <!-- 텍스트 -->
    <p class="text">직접 꾸며놓은 피드! 구경하러 가볼까요?</p>

    <!-- 두 번째 줄 (24개 박스) -->
    <RouterView />
  </main>
</template>

<script setup>
import TheHeader from "@/components/the-header/TheHeader.vue";
import { RouterView } from "vue-router";
</script>

<style scoped>
  @import "./home.css";
</style>
