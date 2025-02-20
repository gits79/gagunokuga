<script setup>
  import { ref, onMounted, onUnmounted } from "vue";
  import { useRoute } from "vue-router";
  import { useFloorEditorStore } from "./floorEditorStore";
  import LeftSidebar from "./LeftSidebar.vue";
  import RightSidebar from "./RightSidebar.vue";
  import { useEditorStore } from '../editorStore';
  import Tutorial from "./Tutorial.vue";

  const store = useFloorEditorStore();
  const canvas = ref(null);
  const route = useRoute();
  const editorStore = useEditorStore();

  // 브라우저 기본 줌 방지
  const preventBrowserZoom = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === '-' || e.key === '+' || e.key === '=') {
        e.preventDefault();
      }
    }
  };

  onMounted(() => {
    store.fetchWalls(route.params.roomId);
    store.initializeCanvas(canvas.value);
    window.addEventListener('keydown', store.handleKeyDown);
    window.addEventListener('keyup', store.handleKeyUp);
    window.addEventListener('keydown', preventBrowserZoom);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', store.handleKeyDown);
    window.removeEventListener('keyup', store.handleKeyUp);
    window.removeEventListener('keydown', preventBrowserZoom);
  });

  const handleSave = () => {
    store.saveWalls();
  };
</script>

<template>
  <div class="editor">
    <LeftSidebar />
    <Tutorial/>
    
    <div
      class="canvas"
      ref="canvas"
      @mousedown.middle.prevent="store.executeToolEvent('onMouseDown', $event)"
      @mousedown="store.executeToolEvent('onMouseDown', $event)"
      @mousemove="store.executeToolEvent('onMouseMove', $event)"
      @mouseup.middle.prevent="store.executeToolEvent('onMouseUp', $event)"
      @mouseup="store.executeToolEvent('onMouseUp', $event)"
      @click="store.executeToolEvent('onClick', $event)"
      @contextmenu.prevent
    ></div>

    <RightSidebar />

  </div>
</template>

<!-- 스타일 -->
<style scoped>
  @import "./floorEditor.css";
</style>