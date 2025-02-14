<script setup>
  import { ref, onMounted } from 'vue';
  import { useLeftSidebarStore } from './leftSidebarStore';
  import { useRoute } from 'vue-router';
  const store = useLeftSidebarStore();
  const route = useRoute();

  const onDragStart = (event, furniture) => {
    event.dataTransfer.setData('furnitureId', furniture.id);
  };
  onMounted(() => {
    store.fetchFurnitureList();
  });
</script>


<template>
  <aside class="sidebar left">
    <router-link :to="`/floor-editor/${route.params.roomId}`">
      <button>도면에디터로</button>
    </router-link>
    <div class="furniture-grid">
      <div
        v-for="furniture in store.furnitureList"
        :key="furniture.id"
        class="furniture-item"
      >
        <img
          :src="furniture.imageUrl"
          :alt="furniture.furnitureName"
          class="furniture-image"
          draggable="true"
          @dragstart="onDragStart($event, furniture)"
        />
        <div class="furniture-name">{{ furniture.furnitureName }}</div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
  @import "./furnitureEditor.css";
</style>