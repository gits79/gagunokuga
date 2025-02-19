<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from 'vue-router';
import { useFurnitureEditorStore } from "./furnitureEditorStore";
import LeftSidebar from "./LeftSidebar.vue";
import RightSidebar from "./RightSidebar.vue";
import Chat from "../../chat/Chat.vue";
import UserShare from "../../room-users/userShareTrigger.vue";

const store = useFurnitureEditorStore();
const canvas = ref(null);
const route = useRoute();

const onDrop = (event) => { // 가구 생성 시 이벤트 전달
  event.preventDefault();
  store.dropFurniture(event);
};

onMounted(async () => {
  await store.initializeWebSocket(route.params.roomId); // WebSocket 연결 초기화
  // await store.subscribeToRoom(); // 구독
  await store.initializeCanvas(canvas.value);
  await store.fetchWalls();
  store.fetchFurnitureList();
  window.addEventListener('keydown', store.handleKeyDown);
});

onBeforeUnmount(() => {
  store.unsubscribeFromRoom(); // 구독 해제 및 연결 종료
});
</script>

<template>
  <div class="editor">
    <LeftSidebar />
    <div
      class="canvas"
      ref="canvas"
      @mousedown="store.executeToolEvent('onMouseDown', $event)"
      @mousemove="store.executeToolEvent('onMouseMove', $event)"
      @mouseup="store.executeToolEvent('onMouseUp', $event)"
      @click="store.executeToolEvent('onClick', $event)"
      @drop="onDrop"
      @dragover="$event.preventDefault()"
    >
    <!-- <svg :viewBox="`${store.viewBox.x} ${store.viewBox.y} ${store.viewBox.width} ${store.viewBox.height}`" class="w-full h-full">
        <rect width="800" height="600" fill="#f3f4f6" />
      </svg> -->
  </div>
    <RightSidebar />
    <chat/>
    <UserShare/>

  </div>
</template>

<style scoped>
  @import "./furnitureEditor.css";
</style>
