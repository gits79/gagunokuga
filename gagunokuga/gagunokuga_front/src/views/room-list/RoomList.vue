<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoomListStore } from './roomListStore'
import defaultThumbnail from '@/assets/gagunokugaLogo.png'
import TheHeader from "@/components/the-header/TheHeader.vue";

const store = useRoomListStore()
const router = useRouter()

const page = ref(1)
const loading = ref(false) // 데이터 로딩 상태
const hasMore = ref(true) // 더 많은 데이터가 있는지 확인

onMounted(() => {
  loadRooms()
})

// 방 불러오기
const loadRooms = async () => {
  if (loading.value) return // 이미 로딩 중이라면 중복 요청 방지
  loading.value = true
  const response = await store.fetchRooms(page.value)
  hasMore.value = response.totalPages > page.value
  page.value++ // 페이지 증가
  loading.value = false
}

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  const bottom = document.documentElement.scrollHeight === document.documentElement.scrollTop + window.innerHeight
  if (bottom && hasMore.value) {
    loadRooms()
  }
}
</script>

<template>
  <TheHeader />
  <div @scroll="handleScroll">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-bold">방 목록</h1>
      <button
          @click="handleCreateRoom"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
      >
        방 생성
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <li
          v-for="room in store.rooms"
          :key="room.roomId"
          class="bg-white p-4 rounded-lg shadow-lg"
      >
        <img
            :src="room.thumbnailUrl || defaultThumbnail"
            alt="방 썸네일"
            class="w-full h-40 object-cover rounded mb-4"
        />
        <h2 class="text-lg font-semibold mb-2 text-center">{{ room.roomName }}</h2>

        <div class="flex space-x-2">
          <button
              @click="goToEditor(room.roomId)"
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            에디터로 이동
          </button>
          <button
              @click="handleUpdateRoomName(room.roomId, room.roomName)"
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            수정
          </button>
          <button
              @click="handleDeleteRoom(room.roomId)"
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </li>
    </div>
  </div>
</template>

<style scoped>
</style>
