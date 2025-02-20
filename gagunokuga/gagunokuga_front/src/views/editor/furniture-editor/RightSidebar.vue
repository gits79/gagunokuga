<script setup>
  import { useFurnitureEditorStore } from "./furnitureEditorStore";
  import { useRoute } from 'vue-router';
  import axiosInstance from "@/api/axiosInstance.js";

  const store = useFurnitureEditorStore();
  const route = useRoute();


</script>

<template>
  <aside class="sidebar-right">
    <button class="back-button">
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
        <path d="" />
      </svg>
    </button>

    <h3 class="panel-title">가구 속성 수정</h3>

    <div class="property-group">
      <!-- Position Controls -->
      <div class="property-item">
        <label>위치</label>
        <div class="position-group">
          <div class="position-item">
            <span class="sub-label">X 좌표</span>
            <div class="control-group">
              <input 
                type="number" 
                v-model="store.selectedFurniture.xpos" 
                @input="store.updateFurniture()"
              >
              <div class="button-group">
                <button @click="store.adjustPosition('x', -10)">-</button>
                <button @click="store.adjustPosition('x', 10)">+</button>
              </div>
            </div>
          </div>
          <div class="position-item">
            <span class="sub-label">Y 좌표</span>
            <div class="control-group">
              <input 
                type="number" 
                v-model="store.selectedFurniture.ypos" 
                @input="store.updateFurniture()"
              >
              <div class="button-group">
                <button @click="store.adjustPosition('y', -10)">-</button>
                <button @click="store.adjustPosition('y', 10)">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Size Controls -->
      <div class="property-item">
        <label>크기</label>
        <div class="position-group">
          <div class="position-item">
            <span class="sub-label">가로</span>
            <div class="control-group">
              <input 
                type="number" 
                v-model="store.selectedFurniture.width" 
                @input="store.updateFurniture()"
              >
              <div class="button-group">
                <button @click="store.adjustSize('width', -10)">-</button>
                <button @click="store.adjustSize('width', 10)">+</button>
              </div>
            </div>
          </div>
          <div class="position-item">
            <span class="sub-label">세로</span>
            <div class="control-group">
              <input 
                type="number" 
                v-model="store.selectedFurniture.height" 
                @input="store.updateFurniture()"
              >
              <div class="button-group">
                <button @click="store.adjustSize('height', -10)">-</button>
                <button @click="store.adjustSize('height', 10)">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rotation Control -->
      <div class="property-item">
        <label>회전 각도</label>
        <div class="control-group">
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
        <div class="control-group">
          <input 
            type="number" 
            v-model.number="store.selectedFurniture.layer" 
            @change="store.changeFurnitureLayer($event.target.value)"
          >
          <div class="button-group">
            <button @click="store.adjustLayer(-1)">-</button>
            <button @click="store.adjustLayer(1)">+</button>
          </div>
        </div>
      </div>
    </div>

    <button @click="store.deleteFurniture()" class="delete-button">
      가구 삭제
    </button>
  </aside>
</template>


<style scoped>
  /* @import "./furnitureEditor.css";*/
  .sidebar-right {
  width: 280px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  
}

.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end; 
  gap: 8px;
  padding: 8px 12px;
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  text-decoration: none;
  margin-bottom: 1rem; 
  margin-left: auto;    /* 오른쪽 정렬을 위해 추가 */
}

.back-button:hover {
  color: #333;
}

.panel-title {
  /* font-size: 16px; */
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  font-family: '42dot Sans', serif;
}

.property-group {
  font-family: '42dot Sans', serif;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  margin-bottom: 1.5rem; /* 삭제 버튼과의 간격 확보 */
  border: 1px solid #eee;  /* 연한 회색 테두리 추가 */
  border-radius: 8px;      /* 모서리 둥글게 */
  padding: 1rem;          /* 내부 여백 추가 */
 background: #fafafa;  /*  배경색 약간 추가 */
}

.property-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
 
}

.property-item label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.position-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.position-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sub-label {
  font-size: 12px;
  color: #666;
}

.control-group input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
  appearance: textfield;
  width: 0;
  flex: 1;
  min-width: 0;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* Chrome, Safari, Edge, Opera */
.control-group input[type="number"]::-webkit-outer-spin-button,
.control-group input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.control-group input[type="number"]:focus {
  border-color: #4f46e5;
  outline: none;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.control-group {
  display: flex;
  gap: 4px;
}
.button-group {
  display: flex;
  gap: 2px;
}

.button-group button {
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: #666;
  cursor: pointer;
  font-size: 14px;
}

.button-group button:hover {
  background: #f8f9fa;
  color: #333;
}

.delete-button {
  font-family: '42dot Sans', serif;
  padding: 0.75rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.delete-button:hover {
  background: #dc2626;
}
</style> 