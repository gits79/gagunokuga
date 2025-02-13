<script setup>
import { onMounted } from 'vue';
import fullpage from 'fullpage.js';

onMounted(() => {
  new fullpage('#fullpage', {
    autoScrolling: true,
    navigation: true,
    scrollHorizontally: true,
    scrollBar: false,
  });
});
</script>

<template>
  <div id="fullpage">
    <section class="section bg-blue-500 text-white flex items-center justify-center h-screen">
      첫 번째 섹션
    </section>
    <section class="section bg-green-500 text-white flex items-center justify-center h-screen">
      두 번째 섹션
    </section>
    <section class="section bg-red-500 text-white flex items-center justify-center h-screen">
      세 번째 섹션
    </section>
  </div>
</template>

<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/fullPage.js/4.0.20/fullpage.min.css';


/* 크롬, 사파리에서 스크롤바 숨기기 */
::-webkit-scrollbar {
    display: none;
}
</style>
