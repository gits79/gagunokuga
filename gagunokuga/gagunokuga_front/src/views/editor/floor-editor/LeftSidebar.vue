<template>
  <aside class="sidebar left">
    <!-- 마우스 좌표 표시 및 단위 변환 버튼 추가 -->
    <div>
      X: {{ store.formatLength(store.mousePosition.x) }}
      Y: {{ store.formatLength(store.mousePosition.y) }}
      <button @click="store.cycleDisplayUnit">
        단위: {{ store.displayUnit }}
      </button>
    </div>

    <router-link to="/room"><button>룸목록</button></router-link>
    <button @click="handleSave">저장</button>
    <button 
      :class="{ 'tool-button': true, 'active': store.toolState.currentTool === 'select' }"
      @click="store.toolState.currentTool = 'select'">선택 툴 [1]</button>
    <button 
      :class="{ 'tool-button': true, 'active': store.toolState.currentTool === 'wall' }"
      @click="store.toolState.currentTool = 'wall'">벽 툴 [2]</button>
    <button 
      :class="{ 'tool-button': true, 'active': store.toolState.currentTool === 'rect' }"
      @click="store.toolState.currentTool = 'rect'">사각형 툴 [3]</button>
    <button 
      :class="{ 'tool-button': true, 'active': store.toolState.currentTool === 'eraser' }"
      @click="store.toolState.currentTool = 'eraser'">지우개 툴 [4]</button>

    <!-- 벽/사각형 도구 선택시 보이는 인터페이스 -->
    <div v-if="['wall', 'rect'].includes(store.toolState.currentTool)">
      <label>벽 두께 (mm)</label>
      <input 
        type="number" 
        :value="store.toolState.wallThickness"
        @input="store.setWallThickness($event.target.value)"
        min="1"
        step="10"
      >
      <div>
        <button @click="store.setWallThickness(store.toolState.wallThickness - 10)">- ( [ )</button>
        <button @click="store.setWallThickness(store.toolState.wallThickness + 10)">+ ( ] )</button>
      </div>
    </div>

    <!-- 지우개 도구 선택시 보이는 인터페이스 -->
    <div v-if="store.toolState.currentTool === 'eraser'">
      <label>지우개 크기</label>
      <input 
        type="number" 
        :value="store.toolState.snapDistance"
        @input="store.setSnapDistance($event.target.value)"
        min="25"
        max="500"
        step="25"
      >
      <div>
        <button @click="store.setSnapDistance(Math.max(25, store.toolState.snapDistance - 25))">- ( [ )</button>
        <button @click="store.setSnapDistance(Math.min(500, store.toolState.snapDistance + 25))">+ ( ] )</button>
      </div>
    </div>

    <!-- 기존 버튼들 -->
    <div>
      <button @click="store.undo" :disabled="!store.canUndo">뒤로 [Ctrl + Z]</button>
      <button @click="store.redo" :disabled="!store.canRedo">앞으로 [Ctrl + Y]</button>
    </div>
    <div>
      <button @click="store.toggleLengthLabels">
        길이표시 {{ store.toolState.showLengthLabels ? '끄기' : '켜기' }} [L]
      </button>
      <button @click="store.toggleGrid()">
        그리드 {{ store.showGrid ? "ON" : "OFF" }} [G]
      </button>
      <button @click="store.toggleKeys()">
        키포인트 {{ store.showKeys ? "ON" : "OFF" }} [K]
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