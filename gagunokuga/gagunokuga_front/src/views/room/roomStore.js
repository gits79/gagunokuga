import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useRoomListStore = defineStore('roomList', () => {
  const rooms = ref([])
  const baseURL = import.meta.env.VITE_API_URL

  // ✅ 방 목록 불러오기
  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/rooms`)
      rooms.value = response.data.rooms
    } catch (error) {
      console.error('방 목록 조회 실패:', error)
      alert('방 목록을 불러오는데 실패했습니다.')
    }
  }

  // ✅ 방 생성
  const createRoom = async (roomName) => {
    try {
      if (!roomName.trim()) {
        throw new Error('방 이름은 필수입니다.')
      }
      const response = await axios.post(`${baseURL}/api/rooms`, { roomName })
      await fetchRooms()
      return response.data
    } catch (error) {
      console.error('방 생성 실패:', error)
      alert(error.response?.data?.message || '방 생성에 실패했습니다.')
    }
  }

  // ✅ 방 삭제
  const deleteRoom = async (roomId) => {
    try {
      if (!roomId) {
        throw new Error('방 ID가 필요합니다.')
      }
      await axios.delete(`${baseURL}/api/rooms/${roomId}`)
      await fetchRooms()
    } catch (error) {
      console.error('방 삭제 실패:', error)
      alert(error.response?.data?.message || '방 삭제에 실패했습니다.')
    }
  }

  // ✅ 방 수정 후 목록 갱신
  const updateRoomName = async (roomId, newName) => {
    try {
      if (!roomId || !newName.trim()) {
        throw new Error('방 ID와 새로운 이름이 필요합니다.')
      }
      await axios.put(`${baseURL}/api/rooms/${roomId}`, { roomName: newName }) // PATCH → PUT 변경
      await fetchRooms() // 변경 후 목록 다시 불러오기
    } catch (error) {
      console.error('방 이름 수정 실패:', error)
      alert(error.response?.data?.message || '방 이름 수정에 실패했습니다.')
    }
  }

  return {
    rooms,
    fetchRooms,
    createRoom,
    deleteRoom,
    updateRoomName, // ✅ 새로 추가한 함수
  }
})
