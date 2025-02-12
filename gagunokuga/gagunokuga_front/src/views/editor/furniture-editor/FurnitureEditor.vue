<script setup>
  import { ref, onMounted } from "vue";
  import { useRoute } from 'vue-router';
  import { useFurnitureEditorStore } from "./furnitureEditorStore";
  import LeftSidebar from "./LeftSidebar.vue";
  import RightSidebar from "./RightSidebar.vue";

  const store = useFurnitureEditorStore();
  const canvas = ref(null);
  const route = useRoute();

  onMounted(() => {
    store.fetchWalls(route.params.roomId);
    store.initializeCanvas(canvas.value);
    window.addEventListener('keydown', store.handleKeyDown);
  });
</script>

<template>
  <div class="editor">
    <LeftSidebar />
    <div
      class="canvas"
      ref="canvas"
      @mousedown="store.executeToolEvent('onMouseDown', $event)"
      @mousemove="store.executeToolEvent('onMouseMove', $event)"
      @mouseup="store.executeToolEvent('onMouseUp', $event)"
      @click="store.executeToolEvent('onClick', $event)"
      @wheel.prevent="store.zoomCanvas"
    ></div>
    <RightSidebar />
  </div>
</template>

<style scoped>
  @import "./furnitureEditor.css";
</style>
