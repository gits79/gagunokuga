<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoomListStore } from './roomStore'
import defaultThumbnail from '@/assets/gagunokugaLogo.png'

const store = useRoomListStore()
const router = useRouter()
const editingRoomId = ref(null)
const editedRoomName = ref('')
const originalRoomName = ref('')

onMounted(() => {
  store.fetchRooms()
})

// ✅ 방 생성
const handleCreateRoom = async () => {
  const name = prompt('새로운 방 이름을 입력하세요:')
  if (name?.trim()) {
    await store.createRoom(name.trim())
  }
}

// ✅ 방 삭제
const handleDeleteRoom = async (roomId) => {
  const confirmDelete = confirm('정말 이 방을 삭제하시겠습니까?')
  if (confirmDelete) {
    await store.deleteRoom(roomId)
  }
}

// ✅ 편집 모드 활성화
const startEditing = (room) => {
  editingRoomId.value = room.roomId
  editedRoomName.value = room.roomName
  originalRoomName.value = room.roomName
}

// ✅ 방 이름 수정 완료
const finishEditing = async (roomId) => {
  if (editedRoomName.value.trim()) {
    await store.updateRoomName(roomId, editedRoomName.value.trim())
  }
  editingRoomId.value = null
}

// ✅ 편집 취소
const cancelEditing = () => {
  editedRoomName.value = originalRoomName.value
  editingRoomId.value = null
}

// ✅ 에디터로 이동
const goToEditor = (roomId) => {
  router.push({ name: 'FloorEditor', params: { roomId } })
}
</script>

<template>
  <div class="room-list-container">
    <h1 class="room-title">나만의 공간 관리하기</h1>
    <p class="room-subtitle">공간의 영감을 기록하고 관리해보세요.</p>
    <div v-if="store.rooms.length > 0">
      <ul>
        <li v-for="room in store.rooms" :key="room.roomId">
          <img :src="room.thumbnailUrl || defaultThumbnail" alt="방 썸네일" />
          <div class="room-info">
            <template v-if="editingRoomId === room.roomId">
              <input v-model="editedRoomName" autofocus @keyup.enter="finishEditing(room.roomId)" />
            </template>
            <template v-else>
              <span>{{ room.roomName }}</span>
              <img class="edit-icon" src="/edit-icon.png" @click="startEditing(room)" alt="편집" />
            </template>
          </div>
          <div>
            <button @click="goToEditor(room.roomId)">에디터로 이동</button>
            <button @click="handleDeleteRoom(room.roomId)">삭제</button>
          </div>
        </li>
      </ul>
      <div>
        <button class="create-room" @click="handleCreateRoom">새 홈 만들기</button>
      </div>
    </div>
    <div v-else class="no-room-container">
      <p class="no-room">현재 생성된 방이 없습니다. 방을 생성해 주세요.</p>
      <button class="first-room" @click="handleCreateRoom">새 홈 만들기</button>
    </div>
  </div>
</template>

<style scoped>
  @import "./room.css";
</style>
