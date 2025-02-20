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
const editor = ref(FurnitureEditor);

onMounted(async () => {
    await loginStore.fetchUserInfo();
    await store.initEditor(route.params.roomId);
    await store.getRole(loginStore.state.nickname);
    if (store.changeEditorMode() === 'floor') {
        store.editor = FloorEditor;
    } else {
        store.editor = FurnitureEditor;
    }
});
</script>

<template>
    <component :is="editor"/>
    <!-- <FloorEditor v-if="store.editorMode === 'floor'"/>
    <FurnitureEditor v-if="store.editorMode === 'furniture'"/>
    <NoRoomAccess v-if="store.editorMode === 'none'"/> -->
</template>

<style scoped>
</style>