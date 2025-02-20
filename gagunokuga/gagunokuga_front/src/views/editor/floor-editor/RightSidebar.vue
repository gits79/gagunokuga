<template>
  <aside class="sidebar-right">
    <div
      @mousedown="store.saveWalls" 
      @click="editorStore.changeEditorMode('furniture')"
      class="back-button"
    >
      가구 에디터로
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </div>

 <!-- Default Settings -->
 <div class="settings-panel">
      <h3 class="panel-title">기본 설정</h3>
      <div class="property-group">
        <div class="property-item">
          <label>기본 벽 두께 (mm)</label>
          <div class="input-group">
            <input
              type="number"
              :value="store.toolState.wallThickness"
              @input="store.setWallThickness($event.target.value)"
              min="1"
              step="10"
            />
            <div class="button-group">
              <button @click="store.setWallThickness(store.toolState.wallThickness - 10)">-</button>
              <button @click="store.setWallThickness(store.toolState.wallThickness + 10)">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Properties -->
    <div class="properties-panel">
      <h3 class="panel-title">속성 편집</h3>

      <!-- Wall Properties -->
      <div v-if="store.selection.selectedWallId" class="property-group">
        <div class="property-item">
          <label>벽 두께 (mm)</label>
          <div class="input-group">
            <input
              type="number"
              :value="store.selectedWallThickness"
              @input="store.updateSelectedWallThickness($event.target.value)"
              min="1"
              step="10"
            />
            <div class="button-group">
              <button @click="store.updateSelectedWallThickness('-')">-</button>
              <button @click="store.updateSelectedWallThickness('+')">+</button>
            </div>
          </div>
        </div>

        <div class="property-item">
          <label>벽 길이 (mm)</label>
          <div class="input-group">
            <input
              type="number"
              :value="store.selectedWallLength"
              @input="store.updateSelectedWallLength($event.target.value)"
              min="1"
              step="100"
            />
            <div class="button-group">
              <button @click="store.updateSelectedWallLength('-')">-</button>
              <button @click="store.updateSelectedWallLength('+')">+</button>
            </div>
          </div>
        </div>

        <button @click="store.deleteSelectedWall" class="delete-button">
          벽 삭제
        </button>
      </div>
      
      <div v-else class="no-selection">
        <p>선택된 개체가 없습니다.</p>
      </div>
    </div>


   
    <div class="bottom-container">
    <!-- coordinates- -->
  <div class="coordinates-panel">
    <div class="coordinates-content">
      <div class="coordinate-row">
        <span>X:</span>
        <span>{{ store.formatLength(store.mousePosition.x) }}</span>
      </div>
      <div class="coordinate-row">
        <span>Y:</span>
        <span>{{ store.formatLength(store.mousePosition.y) }}</span>
      </div>
      <button @click="store.cycleDisplayUnit" class="unit-button">
        단위: {{ store.displayUnit }}
      </button>
    </div>  <!-- 저장 버튼을 맨 아래로 이동 -->
  </div>
  <button @click="store.saveWalls" class="save-button" style="margin-top: auto; background: #4f46e5;">
   도면 저장하기
 </button>
</div>
  </aside>
</template>

<script setup>
import { useFloorEditorStore } from "./floorEditorStore";
import { useRoute } from "vue-router";
import { useEditorStore } from '../editorStore';

const editorStore = useEditorStore();
const store = useFloorEditorStore();
const route = useRoute();
</script>

<style scoped>
    @import "./floorEditor.css";
    @import "./rightSidebar.css";
</style> 