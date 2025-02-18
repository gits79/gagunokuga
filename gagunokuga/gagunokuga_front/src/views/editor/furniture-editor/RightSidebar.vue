<script setup>
  import { useFurnitureEditorStore } from "./furnitureEditorStore";
  const store = useFurnitureEditorStore();
</script>

<template>
  <aside class="sidebar-right">
    <h3 class="panel-title">가구 속성 수정</h3>

    <div class="property-group">
      <!-- Position Controls -->
      <div class="property-item">
        <label>위치</label>
        <div class="input-group">
          <div style="flex: 1">
            <span style="font-size: 12px; color: #666; display: block; margin-bottom: 4px">X 좌표</span>
            <div class="input-group">
              <input 
                type="number" 
                v-model="store.selectedFurniture.xpos" 
                @input="store.updateFurniture()"
              >
              <div class="button-group">
                <button @click="store.adjustPosition('x', -1)">-</button>
                <button @click="store.adjustPosition('x', 1)">+</button>
              </div>
            </div>
          </div>
          <div style="flex: 1">
            <span style="font-size: 12px; color: #666; display: block; margin-bottom: 4px">Y 좌표</span>
            <div class="input-group">
              <input 
                type="number" 
                v-model="store.selectedFurniture.ypos" 
                @input="store.updateFurniture()"
              >
              <div class="button-group">
                <button @click="store.adjustPosition('y', -1)">-</button>
                <button @click="store.adjustPosition('y', 1)">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Size Controls -->
      <div class="property-item">
        <label>크기</label>
        <div class="input-group">
          <div style="flex: 1">
            <span style="font-size: 12px; color: #666; display: block; margin-bottom: 4px">너비</span>
            <div class="input-group">
              <input 
                type="number" 
                v-model="store.selectedFurniture.width" 
                @input="store.updateFurniture()"
              >
              <div class="button-group">
                <button @click="store.adjustSize('width', -1)">-</button>
                <button @click="store.adjustSize('width', 1)">+</button>
              </div>
            </div>
          </div>
          <div style="flex: 1">
            <span style="font-size: 12px; color: #666; display: block; margin-bottom: 4px">높이</span>
            <div class="input-group">
              <input 
                type="number" 
                v-model="store.selectedFurniture.height" 
                @input="store.updateFurniture()"
              >
              <div class="button-group">
                <button @click="store.adjustSize('height', -1)">-</button>
                <button @click="store.adjustSize('height', 1)">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rotation Control -->
      <div class="property-item">
        <label>회전 각도</label>
        <div class="input-group">
          <input 
            type="number" 
            v-model="store.selectedFurniture.rotation" 
            @input="store.updateFurniture()"
          >
          <div class="button-group">
            <button @click="store.adjustRotation(-45)">-</button>
            <button @click="store.adjustRotation(45)">+</button>
          </div>
        </div>
      </div>

      <!-- Layer Control -->
      <div class="property-item">
        <label>레이어</label>
        <div class="input-group">
          <input 
            type="number" 
            v-model="store.selectedFurniture.layer" 
            @input="store.updateFurniture()"
          >
          <div class="button-group">
            <button @click="store.adjustLayer(-1)">-</button>
            <button @click="store.adjustLayer(1)">+</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Button -->
    <button @click="store.deleteFurniture()" class="delete-button">
      가구 삭제
    </button>
  </aside>
</template>

<style scoped>
  @import "./furnitureEditor.css";
</style> 