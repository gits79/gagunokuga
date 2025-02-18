<template>
  <aside class="sidebar-left">
    <div class="tools-container">
      <!-- Room List Link -->
      <router-link to="/room" class="tool-button">
        <svg viewBox="0 0 24 24" class="icon">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
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
          @click="store.handleToolChange('select')"
        >
          <svg viewBox="0 0 24 24" class="icon">
            <path d="M4 4l7 7m-7-7l7 16l3-7l7-3z" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span class="tooltip">선택 [1]</span>
        </button>
        <button 
          class="tool-button"
          :class="{ 'active': store.toolState.currentTool === 'wall' }"
          @click="store.handleToolChange('wall')"
        >
          <svg viewBox="0 0 24 24" class="icon">
            <path d="M4 12h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="tooltip">선 그리기 [2]</span>
        </button>
        <button 
          class="tool-button"
          :class="{ 'active': store.toolState.currentTool === 'rect' }"
          @click="store.handleToolChange('rect')"
        >
          <svg viewBox="0 0 24 24" class="icon">
            <rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span class="tooltip">사각형 그리기 [3]</span>
        </button>
        <button 
          class="tool-button"
          :class="{ 'active': store.toolState.currentTool === 'eraser' }"
          @click="store.handleToolChange('eraser')"
        >
          <svg viewBox="0 0 24 24" class="icon">
            <path d="M20 20H4l4-4m3.5-3.5l7-7a2.12 2.12 0 013 0v0a2.12 2.12 0 010 3l-7 7z" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span class="tooltip">지우개 [4]</span>
        </button>
      </div>

     <!-- Toggle Buttons -->
      <div class="toggle-tools">
        <button @click="store.toggleLengthLabels()" class="tool-button">
          <svg viewBox="0 0 24 24" class="icon">
            <path d="M4 12h16m-3-3l3 3-3 3M7 9l-3 3 3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="tooltip">길이표시 {{ store.toolState.showLengthLabels ? '끄기' : '켜기' }} [L]</span>
        </button>
        <button @click="store.toggleGrid()" class="tool-button">
          <svg viewBox="0 0 24 24" class="icon">
            <path d="M4 4h16v16H4zm5.333 0v16M14.667 4v16M4 9.333h16M4 14.667h16" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span class="tooltip">그리드 {{ store.showGrid ? "끄기" : "켜기" }} [G]</span>
        </button>
        <button @click="store.toggleKeys()" class="tool-button">
          <svg viewBox="0 0 24 24" class="icon">
            <path d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0M12 2v20M2 12h20" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span class="tooltip">키포인트 {{ store.showKeys ? "끄기" : "켜기" }} [K]</span>
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