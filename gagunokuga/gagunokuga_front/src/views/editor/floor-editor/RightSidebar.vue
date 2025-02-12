<template>
  <aside class="sidebar right">
    <button @click="handleMoveToFurniture">가구배치로</button>
    <p>속성 편집</p>

    <!-- 선택된 벽 속성 표시 -->
    <div v-if="store.selection.selectedWallId">
      <!-- 벽 두께 조절 UI -->
      <div>
        <label>벽 두께 (mm)</label>
        <input 
          type="number" 
          :value="store.selectedWallThickness"
          @input="store.updateSelectedWallThickness($event.target.value)"
          min="1"
          step="10"
        />
        <div>
          <button @click="store.updateSelectedWallThickness('-')">-</button>
          <button @click="store.updateSelectedWallThickness('+')">+</button>
        </div>
      </div>

      <!-- 벽 길이 조절 UI -->
      <div>
        <label>벽 길이 (mm)</label>
        <input 
          type="number" 
          :value="store.selectedWallLength"
          @input="store.updateSelectedWallLength($event.target.value)"
          min="1"
          step="100"
        />
        <div>
          <button @click="store.updateSelectedWallLength('-')">-</button>
          <button @click="store.updateSelectedWallLength('+')">+</button>
        </div>
      </div>

      <!-- 벽 삭제 버튼 -->
      <div>
        <button @click="store.deleteSelectedWall" class="delete-button">벽 삭제 [Delete]</button>
      </div>
    </div>

    <div v-else>
      <p>선택된 개체가 없습니다.</p>
    </div>
  </aside>
</template>

<script setup>
  import { useFloorEditorStore } from "./floorEditorStore";
  import { useRoute, useRouter } from "vue-router";

  const store = useFloorEditorStore();
  const route = useRoute();
  const router = useRouter();

  const handleMoveToFurniture = async () => {
    await store.saveWalls();  // 벽 데이터 저장
    router.push(`/furniture-editor/${route.params.roomId}`);  // 저장 후 이동
  };
</script>

<style scoped>
    @import "./floorEditor.css";
</style> 