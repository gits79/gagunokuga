<script setup>
  import { useRoute } from 'vue-router';
  const route = useRoute();
</script>

<template>
  <aside class="sidebar left">
    <router-link :to="`/floor-editor/${route.params.roomId}`">
      <button>도면에디터로</button>
    </router-link>
  </aside>
</template>
  
  
<style scoped>
  @import "./furnitureEditor.css";
</style> 