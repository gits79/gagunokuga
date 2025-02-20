<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoomListStore } from './roomStore'
import defaultThumbnail from '@/assets/gagunokugaLogo.png'
import CreateRoomModal from './CreateRoomModal.vue'
import DeleteRoomModal from './DeleteRoomModal.vue'

const store = useRoomListStore()
const router = useRouter()
const editingRoomId = ref(null)
const editedRoomName = ref('')
const originalRoomName = ref('')
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const roomIdToDelete = ref(null)

onMounted(() => {
  store.fetchRooms()
})

// ✅ 방 생성 모달 열기
const showCreateRoomModal = () => {
  isModalOpen.value = true
}

//  방 삭제 모달 열기
const openDeleteRoomModal = (roomId) => {
  roomIdToDelete.value = roomId
  isDeleteModalOpen.value = true
}

//  방 삭제
const deleteRoom = async () => {
  if (roomIdToDelete.value) {
    await store.deleteRoom(roomIdToDelete.value)
    isDeleteModalOpen.value = false
  }
}

// ✅ 방 생성
const createRoom = async (name) => {
  if (name?.trim()) {
    const roomData = await store.createRoom(name.trim());
    isModalOpen.value = false;
    // 방 생성 후 에디터로 이동
    router.push({ name: 'Editor', params: { roomId: roomData.roomId } });
  }
};

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
  router.push({ name: 'Editor', params: { roomId } })
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
            <button @click="openDeleteRoomModal(room.roomId)">삭제</button>
          </div>
        </li>
      </ul>
      <div>
        <button class="create-room" @click="showCreateRoomModal">새 홈 만들기</button>
      </div>
    </div>
    <div v-else class="no-room-container">
      <p class="no-room">현재 생성된 방이 없습니다. 방을 생성해 주세요.</p>
      <button class="first-room" @click="showCreateRoomModal">새 홈 만들기</button>
    </div>

    <CreateRoomModal v-if="isModalOpen" @close="isModalOpen = false" @create="createRoom" />
    <DeleteRoomModal v-if="isDeleteModalOpen" @close="isDeleteModalOpen = false" @delete="deleteRoom" />
  </div>
</template>

<style scoped>
  @import "./room.css";
</style>
