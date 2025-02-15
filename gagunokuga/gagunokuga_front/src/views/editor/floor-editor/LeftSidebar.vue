<template>
  <aside class="sidebar-left">
    <div class="tools-container">
      <!-- Room List Link -->
      <router-link to="/room" class="tool-button">
        <i class="icon">🏠</i>
      </router-link>

      <!-- Undo/Redo -->
      <div class="tool-group">
        <button class="tool-button" @click="store.undo" :disabled="!store.canUndo">
          <i class="icon">↩</i>
          <span class="tooltip">뒤로 [Ctrl + Z]</span>
        </button>
        <button class="tool-button" @click="store.redo" :disabled="!store.canRedo">
          <i class="icon">↪</i>
          <span class="tooltip">앞으로 [Ctrl + Y]</span>
        </button>
      </div>

      <!-- Main Tools -->
      <div class="tool-group">
        <button 
          class="tool-button"
          :class="{ 'active': store.toolState.currentTool === 'select' }"
          @click="store.toolState.currentTool = 'select'"
        >
          <i class="icon">👆</i>
          <span class="tooltip">선택 [1]</span>
        </button>
        <button 
          class="tool-button"
          :class="{ 'active': store.toolState.currentTool === 'wall' }"
          @click="store.toolState.currentTool = 'wall'"
        >
          <i class="icon">➖</i>
          <span class="tooltip">선 그리기 [2]</span>
        </button>
        <button 
          class="tool-button"
          :class="{ 'active': store.toolState.currentTool === 'rect' }"
          @click="store.toolState.currentTool = 'rect'"
        >
          <i class="icon">⬜</i>
          <span class="tooltip">사각형 그리기 [3]</span>
        </button>
        <button 
          class="tool-button"
          :class="{ 'active': store.toolState.currentTool === 'eraser' }"
          @click="store.toolState.currentTool = 'eraser'"
        >
          <i class="icon">🗑</i>
          <span class="tooltip">지우개 [4]</span>
        </button>
      </div>

      <!-- Coordinates -->
      <div class="coordinates">
        <div>X: {{ store.formatLength(store.mousePosition.x) }}</div>
        <div>Y: {{ store.formatLength(store.mousePosition.y) }}</div>
        <button @click="store.cycleDisplayUnit" class="unit-button">
          단위: {{ store.displayUnit }}
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useFloorEditorStore } from "./floorEditorStore";
const store = useFloorEditorStore();
</script>

<style scoped>
    @import "./floorEditor.css";
    @import "./leftSidebar.css";
</style> 