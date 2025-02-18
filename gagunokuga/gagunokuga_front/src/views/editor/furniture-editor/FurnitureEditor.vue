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

  // 3. 합성된 이미지를 서버로 업로드
  await uploadCapturedImage(combinedImageURL);
};
// 합성을 위해 이미지 불러오기
const loadImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = url;
  });
};

// 캡처 후 이미지를 서버로 전송하는 함수
const uploadCapturedImage = async (imageURL) => {
  const formData = new FormData();
  const blob = convertBase64ToBlob(imageURL);

  formData.append('image', blob, 'comb_img.png'); // 최종 이미지 파일을 'image' 필드로 추가
  formData.append('roomId', route.params.roomId); // 룸 번호 추가

  try {
    console.log("캡쳐전송")
    const response = await axiosInstance.post(`${baseURL}/api/rooms/capture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('이미지 업로드 성공:', response.data);
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
  }
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

// 없을수도 있다 해서 추가함.
const convertBase64ToBlob = (base64Data) => {
  const [header, base64] = base64Data.split(',');
  const mime = header.match(/:(.*?);/)[1]; // MIME 타입 추출
  const binaryString = atob(base64); // Base64를 이진 문자열로 디코딩
  const length = binaryString.length;
  const uint8Array = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  return new Blob([uint8Array], { type: mime }); // Blob 객체 생성
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
    <button class="capture" @click="captureScreen">화면 캡처</button>
    <chat/>
  </div>
</template>

<style scoped>
  @import "./furnitureEditor.css";
</style>
