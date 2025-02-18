<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from 'vue-router';
import { useFurnitureEditorStore } from "./furnitureEditorStore";
import LeftSidebar from "./LeftSidebar.vue";
import RightSidebar from "./RightSidebar.vue";
import Chat from "../../chat/Chat.vue";
import axiosInstance from "@/api/axiosInstance.js";


const store = useFurnitureEditorStore();
const canvas = ref(null);
const route = useRoute();
const baseURL = import.meta.env.VITE_API_URL;

const onDrop = (event) => { // 가구 생성 시 이벤트 전달
  event.preventDefault();
  store.dropFurniture(event);
};

const captureScreen = async () => {
  try {
    const response = await axiosInstance.get(`${baseURL}/api/image/captureElement`, {
      params: {
        url: window.location.href,
        elementClass: "canvas"
      },
      responseType: 'blob' // 이미지 데이터 받기
    });

    if (response.status === 200) {
      const blob = new Blob([response.data], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      downloadImage(url);
    } else {
      console.error("캡처 요청 실패");
    }
  } catch (error) {
    console.error("서버와 통신 중 오류 발생:", error);
  }
};

const downloadImage = (imageUrl) => {
  const a = document.createElement('a');
  a.href = imageUrl;
  a.download = 'captured_canvas.png';
  a.click();
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
    <button @click="captureScreen">화면 캡처</button>
    <chat/>
  </div>
</template>

<style scoped>
  @import "./furnitureEditor.css";
</style>
