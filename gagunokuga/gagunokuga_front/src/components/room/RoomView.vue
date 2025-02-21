<template>
  <div>
    <h1>나의 룸 목록</h1>
    <div class="room-list"> <!-- RoomViewItem을 정렬하기 위함 -->
      <RoomViewItem
          v-for="room in rooms"
          :key="room.id"
          :room="room"
          @room-updated="updateRoomInList"
          @room-deleted="removeRoomFromList"
      />
    </div>
    <div v-if="loading" class="loading">로딩 중...</div>

    <!-- 룸 생성 버튼 -->
    <button class="create-room-btn" @click="openModal">
      룸 생성
    </button>

    <!-- 룸 이름 입력을 위한 모달 -->
    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>룸 이름 입력</h2>
        <input
            v-model="roomName"
            type="text"
            placeholder="룸 이름을 입력하세요"
            @keyup.enter="createRoom"
        />
        <button @click="createRoom">룸 생성</button>
        <button @click="closeModal">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import RoomViewItem from './RoomViewItem.vue';
import axios from 'axios';

export default {
  components: {
    RoomViewItem,
  },
  data() {
    return {
      rooms: [],
      loading: false,
      roomName: '', // 룸 이름을 입력받기 위한 데이터
      isModalOpen: false, // 모달의 열림/닫힘 상태
    };
  },
  created() {
    this.loadRooms();
  },

  methods: {
    async loadRooms() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:8080/room', {
          withCredentials: true, // 백엔드로 데이터 받아오기
        });
        this.rooms = response.data;
      } catch (error) {
        console.error("룸 데이터를 가져오는 데 실패했습니다.", error);
      } finally {
        this.loading = false;
      }
    },

    openModal() {
      this.isModalOpen = true; // 모달 열기
    },

    closeModal() {
      this.isModalOpen = false; // 모달 닫기
      this.roomName = ''; // 이름 초기화
    },

    async createRoom() {
      if (!this.roomName) {
        alert('룸 이름을 입력해주세요!');
        return;
      }

      try {
        const response = await axios.post('http://localhost:8080/room', {
          roomName: this.roomName,
        }, {
          withCredentials: true,
        });

        // 🔥 생성된 룸 데이터를 `router.push`에 전달
        this.$router.push({
          path: `/room/${response.data.id}/wall`,
          query: { roomName: this.roomName } // query로 전달
        });
      } catch (error) {
        console.error("룸 생성에 실패했습니다.", error);
      }
    },

    // 제목 수정 후 리스트 업데이트 (서버에 업데이트는 RoomViewItem에서 처리됨)
    updateRoomInList(updatedRoom) {
      const index = this.rooms.findIndex(room => room.id === updatedRoom.id);
      if (index !== -1) {
        this.rooms[index] = updatedRoom;  // 클라이언트에서 상태 반영
      }
    },

    // 삭제 후 리스트에서 제거 (서버에서 삭제는 RoomViewItem에서 처리됨)
    removeRoomFromList(deletedRoomId) {
      this.rooms = this.rooms.filter(room => room.id !== deletedRoomId);
    },
  }
};
</script>

<style scoped>
.room-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* 아이템 간의 간격 조정 */
}

.room-list > * {
  width: calc(25% - 16px); /* 1줄에 4개 배치 */
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .room-list > * {
    width: calc(50% - 16px); /* 화면이 작은 경우, 1줄에 2개씩 배치 */
  }
}

@media (max-width: 480px) {
  .room-list > * {
    width: 100%; /* 화면이 더 작은 경우, 1줄에 1개씩 배치 */
  }
}

/* 룸 생성 버튼 스타일 */
.create-room-btn {
  position: fixed;
  width : 200px;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.create-room-btn:hover {
  background-color: #0056b3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

.modal-content button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
}

.modal-content button:hover {
  background-color: #0056b3;
}
</style>
