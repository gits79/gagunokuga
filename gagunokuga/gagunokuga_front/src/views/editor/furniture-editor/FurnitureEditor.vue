<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from 'vue-router';
import { useFurnitureEditorStore } from "./furnitureEditorStore";
import LeftSidebar from "./LeftSidebar.vue";
import RightSidebar from "./RightSidebar.vue";
import Chat from "../../chat/Chat.vue";
import axiosInstance from "@/api/axiosInstance.js";
import { Canvg } from 'canvg';

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

// 배경화면 생성
const captureBackground = async (width, height) => {
  const canvasElement = document.createElement('canvas');
  const ctx = canvasElement.getContext('2d');
  canvasElement.width = width;
  canvasElement.height = height;

  // 배경 그리기
  ctx.fillStyle = "#f0f0f0"; // 배경색
  ctx.fillRect(0, 0, width, height);

  // 배경 이미지로 저장
  return canvasElement.toDataURL("image/png");
};
// 캔버스에서 가구, 벽 이미지 생성
const captureSVG = async (svgElement, width, height) => {
  const canvasElement = document.createElement('canvas');
  const ctx = canvasElement.getContext('2d');
  canvasElement.width = width;
  canvasElement.height = height;

  // SVG를 캔버스에 그리기
  const v = await Canvg.from(ctx, svgElement.outerHTML);
  await v.render();

  // SVG 이미지를 저장
  return canvasElement.toDataURL("image/png");
};
// 이미지 캡쳐 후 다운로드
const captureScreen = async () => {
  const svgElement = canvas.value?.querySelector("svg"); // SVG 요소 찾기
  if (!svgElement) {
    console.error("SVG 요소를 찾을 수 없습니다.");
    return;
  }

  const { width, height } = svgElement.getBoundingClientRect();

  // 1. 배경과 SVG 이미지를 각각 캡처
  const backgroundImage = await captureBackground(width, height);
  const svgImage = await captureSVG(svgElement, width, height);

  // 2. 배경과 SVG 이미지를 합친 후 다운로드
  const combinedImageURL = await combineImages(backgroundImage, svgImage, width, height);

  const link = document.createElement("a");
  link.href = combinedImageURL;
  link.download = "combined_image.png";
  link.click();
};
// 이미지 합성
const combineImages = async (backgroundImageURL, svgImageURL, width, height) => {
  const canvasElement = document.createElement('canvas');
  const ctx = canvasElement.getContext('2d');
  canvasElement.width = width;
  canvasElement.height = height;

  // 배경 이미지 그리기
  const backgroundImage = await loadImage(backgroundImageURL);
  ctx.drawImage(backgroundImage, 0, 0, width, height);

  // SVG 이미지 그리기
  const svgImage = await loadImage(svgImageURL);
  ctx.drawImage(svgImage, 0, 0, width, height);

  // 최종 이미지 만들기
  return canvasElement.toDataURL("image/png");
};
// 합성을 위해 이미지 불러오기
const loadImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = url;
  });
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
