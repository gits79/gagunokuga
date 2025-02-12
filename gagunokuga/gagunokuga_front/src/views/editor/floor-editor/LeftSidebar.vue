<template>
  <aside class="sidebar left">
    <router-link to="/room"><button>룸목록</button></router-link>
    <p>툴 모음</p>
    <button @click="handleSave">저장</button>
    <p>현재 툴 : {{ store.toolState.currentTool }}</p>
    <button @click="store.toolState.currentTool = 'select'">선택 툴 [1]</button>
    <button @click="store.toolState.currentTool = 'wall'">벽 툴 [2]</button>
    <button @click="store.toolState.currentTool = 'rect'">사각형 툴 [3]</button>
    <div>
      <label>벽 두께 (mm)</label>
      <input 
        type="number" 
        :value="store.toolState.wallThickness"
        @input="store.setWallThickness($event.target.value)"
        min="1"
        step="10"
      >
      <div>
        <button @click="store.setWallThickness(store.toolState.wallThickness - 10)">-</button>
        <button @click="store.setWallThickness(store.toolState.wallThickness + 10)">+</button>
      </div>
    </div>
    <div>
      <button @click="store.undo" :disabled="!store.canUndo">뒤로 [Ctrl + Z]</button>
    </div>
    <div>
      <button @click="store.redo" :disabled="!store.canRedo">앞으로 [Ctrl + Y]</button>
    </div>
    <div>
      <button @click="store.toggleLengthLabels">
        길이표시 {{ store.toolState.showLengthLabels ? '끄기' : '켜기' }} [L]
      </button>
    </div>
  </aside>
</template>

<script setup>
    import { useFloorEditorStore } from "./floorEditorStore";
    const store = useFloorEditorStore();

    const handleSave = () => {
    store.saveWalls();
    };
</script>

<style scoped>
    @import "./floorEditor.css";
</style> 