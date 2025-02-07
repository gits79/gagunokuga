<script setup>
  import { onMounted } from 'vue'
  import { useRoomListStore } from './roomListStore'
  import defaultThumbnail from '@/assets/gagunokugaLogo.png'

  const store = useRoomListStore()

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
</script>

<template>
  <div>
    <div>
      <h1>방 목록</h1>
      <button @click="handleCreateRoom">방 생성</button>
    </div>
    
    <ul>
      <li v-for="room in store.rooms" :key="room.roomId">
        <img :src="room.thumbnailUrl || defaultThumbnail" alt="방 썸네일" />
        <span>{{ room.roomName }}</span>
        <button @click="handleDeleteRoom(room.roomId)">삭제</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
  @import "./roomList.css";
</style>