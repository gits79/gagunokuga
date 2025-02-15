<template>
  <aside class="sidebar-right">
    <!-- Navigation Buttons -->
    <div class="nav-buttons">
      <router-link :to="`/furniture-editor/${route.params.roomId}`" class="nav-button">
        가구배치로
      </router-link>
      <button class="nav-button" @click="store.saveWalls">
        저장
      </button>
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
          벽 삭제 [Delete]
        </button>
      </div>
      
      <div v-else class="no-selection">
        <p>선택된 개체가 없습니다.</p>
      </div>
    </div>

    <!-- Toggle Buttons -->
    <div class="toggle-buttons">
      <button @click="store.toggleLengthLabels()" class="toggle-button">
        길이표시 {{ store.toolState.showLengthLabels ? '끄기' : '켜기' }} [L]
      </button>
      <button @click="store.toggleGrid()" class="toggle-button">
        그리드 {{ store.showGrid ? "ON" : "OFF" }} [G]
      </button>
      <button @click="store.toggleKeys()" class="toggle-button">
        키포인트 {{ store.showKeys ? "ON" : "OFF" }} [K]
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useFloorEditorStore } from "./floorEditorStore";
import { useRoute } from "vue-router";

const store = useFloorEditorStore();
const route = useRoute();
</script>

<style scoped>
    @import "./floorEditor.css";
    @import "./rightSidebar.css";
</style> 