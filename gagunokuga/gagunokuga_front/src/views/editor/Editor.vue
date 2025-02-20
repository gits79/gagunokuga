<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from "vue-router";
import FloorEditor from './floor-editor/FloorEditor.vue';
import FurnitureEditor from './furniture-editor/FurnitureEditor.vue';
import NoRoomAccess from './NoRoomAccess.vue';
import { useLoginStore } from '../login/login';
import { useEditorStore } from './editorStore';

const route = useRoute();
const loginStore = useLoginStore();
const store = useEditorStore();

onMounted(async () => {
    await loginStore.fetchUserInfo();
    await store.initEditor(route.params.roomId);
    await store.getRole(loginStore.state.nickname);
    store.changeEditorMode()
});
</script>

<template>
    <FloorEditor v-if="store.editorMode === 'floor'"/>
    <FurnitureEditor v-if="store.editorMode === 'furniture'"/>
    <NoRoomAccess v-if="store.editorMode === 'none'"/>
</template>

<style scoped>
</style>