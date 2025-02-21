<template>
  <div>
    <h1>룸 에디터</h1>
    <div v-if="room">
      <h2>{{ room.roomName }}</h2>
      <p>룸 ID: {{ room.id }}</p>
      <p>룸 이름: {{ room.roomName }}</p>
    </div>
    <div v-if="loading" class="loading">로딩 중...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roomId: this.$route.params.id,  // URL에서 id 가져오기
      roomName: this.$route.query.roomName || '', // 🔥 query로 전달된 roomName 사용
      room: null,  // room 객체 추가
      loading: false, // 로딩 상태 추가
      error: null // 에러 상태 추가
    };
  },
  created() {
    this.fetchRoomData();
  },
  methods: {
    async fetchRoomData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`/rooms/${this.roomId}`);
        if (!response.ok) {
          throw new Error("룸 데이터를 불러오지 못했습니다.");
        }
        this.room = await response.json();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.loading {
  color: blue;
}

.error {
  color: red;
}
</style>
