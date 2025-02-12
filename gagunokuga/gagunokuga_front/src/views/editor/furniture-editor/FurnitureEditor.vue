<script setup>
  import { ref, onMounted } from "vue";
  import { useRoute } from 'vue-router';
  import { useFurnitureEditorStore } from "./furnitureEditorStore";
  import LeftSidebar from "./LeftSidebar.vue";
  import RightSidebar from "./RightSidebar.vue";

  const store = useFurnitureEditorStore();
  const canvas = ref(null);
  const route = useRoute();

  const onDrop = (event) => {
    event.preventDefault();
    store.createImage(event);
    const furnitureId = event.dataTransfer.getData('furnitureId');
    const rect = canvas.value.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    logDroppedFurniture(x, y, furnitureId);
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const logDroppedFurniture = (x, y, id) => {
    console.log('Dropped furniture:', { x, y, id });
  };

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
      @drop="onDrop"
      @dragover="onDragOver"
    >
    <!-- <svg :viewBox="`${store.viewBox.x} ${store.viewBox.y} ${store.viewBox.width} ${store.viewBox.height}`" class="w-full h-full">
        <rect width="800" height="600" fill="#f3f4f6" />
      </svg> -->
  </div>
    <RightSidebar />
  </div>
</template>

<style scoped>
  @import "./furnitureEditor.css";
</style>
