<script setup>
  import { useFurnitureEditorStore } from "./furnitureEditorStore";
  import { ref } from "vue";
  const store = useFurnitureEditorStore();
</script>

<template>
  <aside class="sidebar left">
    <div class="container">
    <h2>가구 속성 수정</h2>

    <div class="form-group">
      <label for="furnitureId">가구 ID</label>
      <input type="number" v-model="store.selectedFurniture.furnitureId" @input="store.updateFurniture('furnitureId', store.selectedFurniture.furnitureId)">
    </div>

    <div class="form-group">
      <label for="furnitureName">가구 이름</label>
      <input type="text" v-model="store.selectedFurniture.furnitureName" @input="store.updateFurniture('furnitureName', store.selectedFurniture.furnitureName)">
    </div>

    <div class="form-group">
      <label for="imageUrl">이미지 URL</label>
      <input type="text" v-model="store.selectedFurniture.imageUrl" @input="store.updateFurniture('imageUrl', store.selectedFurniture.imageUrl)">
    </div>

    <div class="form-group">
      <label for="roomId">방 ID</label>
      <input type="number" v-model="store.selectedFurniture.roomId" @input="store.updateFurniture('roomId', store.selectedFurniture.roomId)">
    </div>

    <div class="form-group input-inline">
      <div>
        <label for="xpos">X 좌표</label>
        <input type="number" v-model="store.selectedFurniture.xpos" @input="store.updateFurniture('xpos', store.selectedFurniture.xpos)">
      </div>
      <div>
        <label for="ypos">Y 좌표</label>
        <input type="number" v-model="store.selectedFurniture.ypos" @input="store.updateFurniture('ypos', store.selectedFurniture.ypos)">
      </div>
    </div>

    <div class="form-group input-inline">
      <div>
        <label for="width">너비</label>
        <input type="number" v-model="store.selectedFurniture.width" @input="store.updateFurniture('width', store.selectedFurniture.width)">
      </div>
      <div>
        <label for="height">높이</label>
        <input type="number" v-model="store.selectedFurniture.height" @input="store.updateFurniture('height', store.selectedFurniture.height)">
      </div>
    </div>

    <div class="form-group">
      <label for="rotation">회전 각도</label>
      <input type="number" v-model="store.selectedFurniture.rotation" @input="store.updateFurniture('rotation', store.selectedFurniture.rotation)">
    </div>

    <div class="form-group">
      <label for="layer">레이어</label>
      <input type="number" v-model="store.selectedFurniture.layer" @input="store.updateFurniture('layer', store.selectedFurniture.layer)">
    </div>
  </div>
  </aside>
</template>
  
<style scoped>
  @import "./furnitureEditor.css";
</style> 