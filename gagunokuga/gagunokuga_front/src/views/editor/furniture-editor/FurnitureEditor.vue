<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from 'vue-router';
import { useFurnitureEditorStore } from "./furnitureEditorStore";
import LeftSidebar from "./LeftSidebar.vue";
import RightSidebar from "./RightSidebar.vue";
import Chat from "../../chat/Chat.vue";
import axiosInstance from "@/api/axiosInstance.js";
import { Canvg } from 'canvg';
import html2canvas from 'html2canvas';

const store = useFurnitureEditorStore();
const canvas = ref(null);
const route = useRoute();
const baseURL = import.meta.env.VITE_API_URL;

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


// 화면 캡처 기능
const captureScreen = () => {
  const svgElement = document.querySelector('.canvas'); // 또는 document.querySelector('#your-svg-id');
  if (svgElement) {
    html2canvas(svgElement).then(canvas => {
      // 캡처된 canvas에서 이미지를 PNG로 변환
      const imageURL = canvas.toDataURL("image/png");

      // 이미지 다운로드 링크 생성
      const link = document.createElement("a");
      link.href = imageURL;
      link.download = "furniture_editor_capture.png";
      link.click();  // 이미지 다운로드
    });
  } else {
    console.error("SVG element not found");
  }
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
    <button @click="captureScreen">화면 캡처</button>
    <chat/>
  </div>
</template>

<style scoped>
  @import "./furnitureEditor.css";
</style>
