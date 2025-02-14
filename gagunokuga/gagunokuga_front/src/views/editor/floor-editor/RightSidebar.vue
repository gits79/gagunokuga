<template>
  <aside class="sidebar-right">
    <!-- router-link를 사용하여 이동 -->
    <router-link :to="`/furniture-editor/${route.params.roomId}`" class="button-link">
      <button>
        가구배치로
      </button>
    </router-link>
    <p>속성 편집</p>

    <!-- 선택된 벽 속성 표시 -->
    <div v-if="store.selection.selectedWallId">
      <!-- 벽 두께 조절 UI -->
      <div class="scale-changer">
        <div class="scale-info">
          <label>벽 두께 (mm)</label>
          <input
              type="number"
              :value="store.selectedWallThickness"
              @input="store.updateSelectedWallThickness($event.target.value)"
              min="1"
              step="10"
          />
        </div>
        <div class="plus-minus">
          <button class="pm-btn" @click="store.updateSelectedWallThickness('-')">-</button>
          <button class="pm-btn" @click="store.updateSelectedWallThickness('+')">+</button>
        </div>
      </div>

      <!-- 벽 길이 조절 UI -->
      <div class="scale-changer">
        <div class="scale-info">
          <label>벽 길이 (mm)</label>
          <input
            type="number"
            :value="store.selectedWallLength"
            @input="store.updateSelectedWallLength($event.target.value)"
            min="1"
            step="100"
          />
        </div>
        <div class="plus-minus">
          <button class="pm-btn" @click="store.updateSelectedWallLength('-')">-</button>
          <button class="pm-btn" @click="store.updateSelectedWallLength('+')">+</button>
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

    <!-- 기존 버튼들 -->
    <div>
      <button @click="store.toggleLengthLabels()">
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
  import { useRoute, useRouter } from "vue-router";

  const store = useFloorEditorStore();
  const route = useRoute();

</script>

<style scoped>
    @import "./floorEditor.css";
</style> 