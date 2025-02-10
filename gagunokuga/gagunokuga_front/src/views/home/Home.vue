<template>
  <main class="content flex flex-col items-center p-5 overflow-auto min-h-0">
    <!-- 첫 번째 줄 (2개 정사각형 박스) -->
    <div class="row flex justify-center gap-5 max-w-screen-lg w-full">
      <div class="box bg-gray-300 flex justify-center items-center aspect-square w-full overflow-hidden"></div>
      <router-link to="/floor-plan-editor" class="box bg-red-500 flex justify-center items-center aspect-square w-full overflow-hidden">
        <img class="logo w-full h-full object-contain p-2" src="@/assets/gagunokuga_logo_link.svg" alt="도면에디터 바로가기" />
      </router-link>
    </div>

    <!-- 텍스트 -->
    <p class="text text-lg my-5">직접 꾸며놓은 피드! 구경하러 가볼까요?</p>

    <!-- 두 번째 줄 (24개 박스) -->
    <div class="row grid grid-cols-4 gap-4 max-w-screen-lg w-full p-2">
      <div v-for="i in 24" :key="i" class="box bg-gray-300 flex justify-center items-center aspect-square w-full overflow-hidden"></div>
    </div>
  </main>
</template>

<script setup>
</script>

<style scoped>
</style>
