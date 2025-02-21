<template>
  <div class="sidebar-container">
    <!-- Toggle Button -->
    <button 
      class="sidebar-toggle"
      @click="isOpen = !isOpen"
      :class="{ 'open': isOpen }"
    >
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>

    <!-- Sidebar -->
    <aside class="sidebar left" :class="{ 'open': isOpen }">
      <div class="sidebar-content">
        <!-- Back to Floor Editor Button -->
        <div
          v-if="editorStore.role === 'host'"
          @click="editorStore.changeEditorMode('floor')" 
          class="back-button"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          도면 에디터로
        </div>

        <!-- Layer Selection -->
        <div class="layer-selection">
          <label for="layer">레이어:</label>
          <select v-model="selectedLayer" id="layer" class="layer-select">
            <option v-for="n in 11" :key="n-1" :value="n-1">
              레이어 {{n-1}}
            </option>
          </select>
        </div>

        <!-- Search Box -->
        <div class="search-box">
          <input 
            type="search"
            :value="searchKeyword"
            placeholder="가구 검색..."
            @input="handleSearch"
          />
        </div>

        <!-- Furniture Grid -->
        <div class="furniture-grid">
          <div
            v-for="furniture in store.furnitureList"
            :key="furniture.id"
            class="furniture-item"
            draggable="true"
            @dragstart="onDragStart($event, furniture)"
          >
            <img
              :src="furniture.imageUrl"
              :alt="furniture.furnitureName"
              class="furniture-image"
              draggable="false"
            />
            <span class="furniture-name">{{ furniture.furnitureName }}</span>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useLeftSidebarStore } from './leftSidebarStore';
import { useRoute } from 'vue-router';
import { debounce } from 'lodash';
import { useEditorStore } from '../editorStore';

const editorStore = useEditorStore();
const store = useLeftSidebarStore();
const route = useRoute();
const isOpen = ref(true);
const selectedLayer = ref(0);
const searchKeyword = ref('');
const isComposing = ref(false);  // IME 조합 중인지 확인하는 플래그

const onDragStart = (event, furniture) => {
  event.dataTransfer.setData('furnitureId', furniture.id);
  event.dataTransfer.setData('selectedLayer', selectedLayer.value.toString());
};

// debounce를 사용하여 검색 딜레이 추가
const debouncedSearch = debounce((value) => {
  store.fetchFurnitureList(value);
}, 300);  // 300ms 딜레이

const handleSearch = (e) => {
  searchKeyword.value = e.target.value;
  store.fetchFurnitureList(e.target.value);
};

const onCompositionEnd = () => {
  isComposing.value = false;
  store.fetchFurnitureList(searchKeyword.value);
};

watch(searchKeyword, (newValue) => {
  debouncedSearch(newValue);
});

onMounted(() => {
  store.fetchFurnitureList('');
});
</script>

<style scoped>
  /* @import "./furnitureEditor.css"; */
  .sidebar-container {
  position: relative;
  height: 100%;
}

.sidebar.left {
  width: 280px;
  height: 100%;
  background-color: white;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  position: absolute;
  left: -280px;
  transition: left 0.3s ease;
  z-index: 10;
}

.sidebar.left.open {
  left: 0;
}

.sidebar-toggle {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background-color: white;
  border: 1px solid #eee;
  border-left: none;
  border-radius: 0 24px 24px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  transition: left 0.3s ease;
}

.sidebar-toggle.open {
  left: 280px;
}

.sidebar-toggle svg {
  transition: transform 0.3s ease;
}

.sidebar-toggle.open svg {
  transform: rotate(180deg);
}

.sidebar-content {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
}

.back-button {
  font-family: '42dot Sans', serif;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: none;
  border: none;
  color: #666;
  text-decoration: none;
  margin-bottom: 20px;
  
}

.back-button:hover {
  color: #333;
  cursor: pointer;
}

.furniture-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 8px;
}

.furniture-item {
  background-color: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.2s ease;
  cursor: move;
  
}

.furniture-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.furniture-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 8px;
}

.furniture-name {
  font-size: 14px;
  color: #666;
  text-align: center;
  font-family: '42dot Sans', serif;
}

.layer-selection {
  padding: 10px;
  margin-bottom: 15px;
}

.layer-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 1px;
}

.search-box {
  padding: 10px;
  margin-bottom: 10px;
}

.search-box input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-box input:focus {
  outline: none;
  border-color: #4CAF50;
}

.layer-selection {
  padding: 13px;
  margin-bottom: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.layer-selection label {
  display: block;
  color: #4a5568;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
  font-family: '42dot Sans', serif;
}

.layer-select {
  font-family: '42dot Sans', serif;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: white;
  color: #2d3748;
  font-size: 14px;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234a5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

.layer-select:hover {
  border-color: #5e6469;
}

.layer-select:focus {
  outline: none;
  border-color: #132636;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
}

.search-box {
  padding: 16px;
  margin-bottom: 20px;
}

.search-box input {
  width: 100%;
  padding: 8px 15px;
  padding-left: 36px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234a5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3ccircle cx='11' cy='11' r='8'%3e%3c/circle%3e%3cline x1='21' y1='21' x2='16.65' y2='16.65'%3e%3c/line%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: left 12px center;
  background-size: 16px;
  transition: all 0.2s ease;
}

.search-box input:hover {
  border-color: #464a4e;
}

.search-box input:focus {
  outline: none;
  border-color: #173852;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
}

.search-box input::placeholder {
  color: #a0aec0;
  font-family: '42dot Sans', serif;
}
</style>