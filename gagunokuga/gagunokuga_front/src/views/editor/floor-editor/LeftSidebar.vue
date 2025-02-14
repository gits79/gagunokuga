<template>
  <aside class="sidebar-left">

    <div class="head-left">
      <router-link to="/room" class="button-link"><button>룸목록</button></router-link>

      <div class="xy">
        <button class="btn-xy" @click="store.undo" :disabled="!store.canUndo">뒤로 <br> [Ctrl + Z]</button>
        <button class="btn-xy" @click="store.redo" :disabled="!store.canRedo">앞으로 <br> [Ctrl + Y]</button>
      </div>
    </div>

    <div class="body-left">
      <div class="controller">
        <div class="button-container">
          <!-- 저장 버튼 (가장 앞에 배치) -->
          <button class="tool-button save" @click="saveData">
            💾
          </button>

          <button class="tool-button select" :class="{ 'active': store.toolState.currentTool === 'select' }"
                  @click="store.toolState.currentTool = 'select'">
          <span class="tool-text">
            선택[1]
          </span>
          </button>

          <button class="tool-button wall" :class="{ 'active': store.toolState.currentTool === 'wall' }"
                  @click="store.toolState.currentTool = 'wall'">
            <span class="tool-text">선 그리기[2]</span>
          </button>

          <button class="tool-button rect" :class="{ 'active': store.toolState.currentTool === 'rect' }"
                  @click="store.toolState.currentTool = 'rect'">
            <span class="tool-text">사각형 그리기[3]</span>
          </button>

          <button class="tool-button eraser" :class="{ 'active': store.toolState.currentTool === 'eraser' }"
                  @click="store.toolState.currentTool = 'eraser'">
            <span class="tool-text">지우개[4]</span>
          </button>
        </div>
      </div>

      <!-- 벽/사각형 도구 선택시 보이는 인터페이스 -->
      <div v-if="['wall', 'rect'].includes(store.toolState.currentTool)" class="scale-changer">
        <div class="scale-info">
          <label>벽 두께 (mm)</label>
          <input
              type="number"
              :value="store.toolState.wallThickness"
              @input="store.setWallThickness($event.target.value)"
              min="1"
              step="10"
          >
        </div>
        <div class="plus-minus">
          <button class="pm-btn" @click="store.setWallThickness(store.toolState.wallThickness - 10)">- ( [ )</button>
          <button class="pm-btn" @click="store.setWallThickness(store.toolState.wallThickness + 10)">+ ( ] )</button>
        </div>
        <button @click="handleCancel" class="btn-left">
          그리기 취소 [ESC]
        </button>
      </div>

      <!-- 지우개 도구 선택시 보이는 인터페이스 -->
      <div v-if="store.toolState.currentTool === 'eraser'" class="scale-changer">
        <div class="scale-info">
          <label>지우개 크기</label>
          <input
              type="number"
              :value="store.toolState.snapDistance"
              @input="store.setSnapDistance($event.target.value)"
              min="25"
              max="500"
              step="25"
          >
        </div>
        <div class="plus-minus">
          <button class="pm-btn" @click="store.setSnapDistance(Math.max(25, store.toolState.snapDistance - 25))">- ( [ )</button>
          <button class="pm-btn" @click="store.setSnapDistance(Math.min(500, store.toolState.snapDistance + 25))">+ ( ] )</button>
        </div>
      </div>
    </div>


    <!-- 마우스 좌표 표시 및 단위 변환 버튼 추가 -->
    <div class="tail-left">
      X: {{ store.formatLength(store.mousePosition.x) }}
      Y: {{ store.formatLength(store.mousePosition.y) }}
      <button @click="store.cycleDisplayUnit" class="btn-left">
        단위: {{ store.displayUnit }}
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

    const handleCancel = () => {
      if (store.toolState.currentTool === 'wall') {
        store.wallControls.cancel();
      } else if (store.toolState.currentTool === 'rect') {
        store.rectTool.cancel();
      }
    };

    const handleToggleLengthLabels = () => {
      store.toggleLengthLabels();
      store.updateVisualElements();
    };
</script>

<style scoped>
    @import "./floorEditor.css";
    @import "./leftSidebar.css";
</style> 