<script setup>
  import { useFurnitureEditorStore } from "./furnitureEditorStore";
  import { ref } from "vue";
  import Chat from "../../chat/Chat.vue";
  const store = useFurnitureEditorStore();
</script>

<template>
  <aside class="sidebar left">
    <div class="container">
    <h2>가구 속성 수정</h2>

    <!-- <div class="form-group">
      <label for="furnitureId">가구 ID</label>
      <input type="number" v-model="store.selectedFurniture.furnitureId" disabled>
    </div>

    <div class="form-group">
      <label for="furnitureName">가구 이름</label>
      <input type="text" v-model="store.selectedFurniture.furnitureName" disabled>
    </div>

    <div class="form-group">
      <label for="imageUrl">이미지 URL</label>
      <input type="text" v-model="store.selectedFurniture.imageUrl" disabled>
    </div>

    <div class="form-group">
      <label for="roomId">방 ID</label>
      <input type="number" v-model="store.roomId" disabled>
    </div> -->

    <div class="form-group input-inline">
      <div>
        <label for="xpos">X 좌표</label>
        <input type="number" v-model="store.selectedFurniture.xpos" @input="store.updateFurniture()">
      </div>
      <div>
        <label for="ypos">Y 좌표</label>
        <input type="number" v-model="store.selectedFurniture.ypos" @input="store.updateFurniture()">
      </div>
    </div>

    <div class="form-group input-inline">
      <div>
        <label for="width">너비</label>
        <input type="number" v-model="store.selectedFurniture.width" @input="store.updateFurniture()">
      </div>
      <div>
        <label for="height">높이</label>
        <input type="number" v-model="store.selectedFurniture.height" @input="store.updateFurniture()">
      </div>
    </div>

    <div class="form-group">
      <label for="rotation">회전 각도</label>
      <input type="number" v-model="store.selectedFurniture.rotation" @input="store.updateFurniture()">
    </div>

    <div class="form-group">
      <label for="layer">레이어</label>
      <input type="number" v-model="store.selectedFurniture.layer" @input="store.updateFurniture()">
    </div>
    <div class="form-group">
        <button @click="store.deleteFurniture()" class="btn-delete">삭제</button>
    </div>
  </div>
  </aside>
  <chat/>
</template>
  
<style scoped>
  @import "./furnitureEditor.css";
</style> 