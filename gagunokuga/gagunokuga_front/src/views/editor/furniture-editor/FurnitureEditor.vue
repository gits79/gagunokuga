<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { useFurnitureEditorStore } from "./furnitureEditorStore";
import LeftSidebar from "./LeftSidebar.vue";
import RightSidebar from "./RightSidebar.vue";
import Chat from "../../chat/Chat.vue";
import axiosInstance from "@/api/axiosInstance.js";
import { Canvg } from 'canvg';
import { captureScreen } from "./furnitureCapture.js";
import UserShare from "../../room-users/UserShareTrigger.vue";
import { useEditorStore } from '../editorStore';
import axios from "axios";

const store = useFurnitureEditorStore();
const canvas = ref(null);
const route = useRoute();
const router = useRouter();
const baseURL = import.meta.env.VITE_API_URL;
const editorStore = useEditorStore();

const onDrop = (event) => { // 가구 생성 시 이벤트 전달
  event.preventDefault();
  store.dropFurniture(event);
};

onMounted(async () => {
  await store.initializeWebSocket(route.params.roomId); // WebSocket 연결 초기화
  // await store.subscribeToRoom(); // 구독
  await store.initializeCanvas(canvas.value);
  await store.fetchWalls();
  // store.fetchFurnitureList();
  window.addEventListener('keydown', store.handleKeyDown);
});

onBeforeUnmount(() => {
  store.unsubscribeFromRoom(); // 구독 해제 및 연결 종료
});

const handleCapture = async () => {
  await captureScreen(canvas, route.params.roomId, baseURL);
};

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

    <router-link
        :to="`/room`"
        class="capture"
        @click="handleCapture"
    >
      마이 홈으로
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
        <path d="M9 6l6 6-6 6" transform="translate(3, 6)" />
      </svg>
    </router-link>
    <UserShare/>
  </div>
</template>

<style scoped>
  @import "./furnitureEditor.css";
</style>
