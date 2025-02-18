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
        <router-link 
          :to="`/floor-editor/${route.params.roomId}`" 
          class="back-button"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          도면 에디터로
        </router-link>

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
import { ref, onMounted } from 'vue';
import { useLeftSidebarStore } from './leftSidebarStore';
import { useRoute } from 'vue-router';

const store = useLeftSidebarStore();
const route = useRoute();
const isOpen = ref(true);

const onDragStart = (event, furniture) => {
  event.dataTransfer.setData('furnitureId', furniture.id);
};

onMounted(() => {
  store.fetchFurnitureList();
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
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  text-decoration: none;
  margin-bottom: 20px;
}

.back-button:hover {
  color: #333;
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
}
</style>