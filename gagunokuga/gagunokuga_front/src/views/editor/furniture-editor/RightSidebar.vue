<script setup>
  import { useFurnitureEditorStore } from "./furnitureEditorStore";
  import { ref } from "vue";
  const store = useFurnitureEditorStore();
</script>

<template>
  <aside class="sidebar left">
    <!-- 현재 선택된 가구의 이름, 좌표, 가로세로, 회전 표시 -->
      <div class="selected-furniture-info">
        <div class="selected-furniture-name">{{ store.selectedFurniture?.furnitureName }}</div>
        <div class="selected-furniture-position">
          <span>x: {{ store.selectedFurniture?.xpos }}</span>
          <span>y: {{ store.selectedFurniture?.ypos }}</span>
        </div>
        <div class="selected-furniture-size">
          <span>w: {{ store.selectedFurniture?.width }}</span>
          <span>h: {{ store.selectedFurniture?.height }}</span>
        </div>
        <div class="selected-furniture-rotation">{{ store.selectedFurniture?.rotation }}</div>
      </div>
  </aside>
</template>
  
<style scoped>
  @import "./furnitureEditor.css";
</style> 