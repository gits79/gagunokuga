<script setup>
</script>

<template>
  <header class="flex justify-between items-center px-24 py-12 bg-white">
    <router-link to="/" class="logo-link">
      <img class="logo w-[150px] h-auto" src="@/assets/gagunokuga_logo_text.svg" alt="가구놓구가" />
    </router-link>
    <nav class="flex gap-5 items-center justify-end">
      <li><router-link to="/login" class="text-black text-base no-underline">로그인</router-link></li>
      <li><router-link to="/room" class="text-black text-base no-underline">MY홈</router-link></li>
      <li class="highlight">
        <router-link to="/editor/35" class="text-[#EF5C4E] font-bold no-underline">도면에디터</router-link>
      </li> <!-- 화면 확인을 위해 임의로 숫자 생성함. 차후 수정 필요 -->
    </nav>
  </header>
</template>

<style>
/* 기존의 CSS 코드나 scoped 스타일을 제거한 상태 */
</style>
