<template>
  <div class="room-item">
    <img :src="room.thumbnail_url" alt="Room Image" class="room-image" />

    <!-- 제목 수정 가능하도록 input 추가 -->
    <div class="room-header">
      <input
          v-if="editing"
          v-model="editedRoomName"
          @keyup.enter="updateRoomTitle"
      />
      <h3 v-else>{{ room.roomName }}</h3>

      <!-- 수정 및 삭제 버튼 -->
      <div class="room-actions">
        <button @click="startEditing" v-if="!editing">✏️ 수정</button>
        <button @click="updateRoomTitle" v-if="editing">✔️ 저장</button>
        <button @click="cancelEdit" v-if="editing">❌ 취소</button> <!-- 취소 버튼 추가 -->
        <button @click="deleteRoom">🗑️ 삭제</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    room: Object, // 부모로부터 전달받은 room 정보를 prop으로 받음
  },
  data() {
    return {
      editing: false, // 수정 모드 여부
      editedRoomName: this.room.roomName, // 변경될 제목
    };
  },
  methods: {
    // 수정 버튼 클릭 시 입력창 활성화
    startEditing() {
      this.editing = true;
      this.editedRoomName = this.room.roomName;
    },

    // 수정 취소 (input에서 포커스가 벗어났을 때)
    cancelEdit() {
      this.editing = false;
      this.editedRoomName = this.room.roomName;
    },

    // 제목 수정 API 요청
    async updateRoomTitle() {
      if (!this.editedRoomName.trim()) return; // 빈 제목 방지

      try {
        const response = await axios.put(`http://localhost:8080/room/${this.room.id}`,
            {
              newRoomName: this.editedRoomName,
            }, // 🔥 params 대신 JSON 데이터로 변경
            { headers: { "Content-Type": "application/json" } } // JSON 요청 명시
        );

        this.$emit("room-updated", response.data); // 부모에게 변경 알림
        this.editing = false;
      } catch (error) {
        console.error("🔴 수정 실패:", error);
      }
    },

    // 삭제 API 요청
    async deleteRoom() {
      if (!confirm("정말 삭제하시겠습니까?")) return;

      try {
        await axios.delete(`http://localhost:8080/room/${this.room.id}`);
        this.$emit("room-deleted", this.room.id); // 부모 컴포넌트에 알림
      } catch (error) {
        console.error("룸 삭제 실패:", error);
      }
    }
  }
};
</script>

<style scoped>
.room-item {
  text-align: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  position: relative;
}

.room-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.room-header input {
  width: 60%;
  padding: 5px;
}

.room-actions {
  display: flex;
  gap: 5px;
}

.room-actions button {
  background: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
}

.room-actions button:hover {
  background: #0056b3;
}

.room-actions button:nth-child(2) { /* 삭제 버튼 */
  background: #dc3545;
}

.room-actions button:nth-child(2):hover {
  background: #b02a37;
}
</style>
