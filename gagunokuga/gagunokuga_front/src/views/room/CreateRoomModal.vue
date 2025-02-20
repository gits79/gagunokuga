<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">&times;</button>
      <h2 class="modal-title">홈 만들기</h2>
      <p class="modal-description">나만의 방을 생성하세요</p>
      <div class="input-container">
        <input
          ref="roomInput"
          v-model="roomName"
          placeholder="방 이름을 입력하세요"
          class="input-box"
          @keyup.enter="submit"
        />
      </div>
      <button class="create-button" @click="submit">만들기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits();
const roomName = ref('');
const roomInput = ref(null);

const submit = async () => {
  if (roomName.value.trim()) {
    const roomData = await emit('create', roomName.value);
    roomName.value = '';
    return roomData; // 방 생성 후 roomId를 반환
  }
};

const closeModal = () => {
  emit('close');
};

onMounted(() => {
  if (roomInput.value) {
    roomInput.value.focus();
  }
});
</script>

<style scoped>
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
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  width: 350px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;
}

.close-button:hover {
  color: #000;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.modal-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.input-container {
  margin-bottom: 16px;
}

.input-box {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}

.create-button {
  width: 100%;
  padding: 10px;
  background: #3d3d3d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 8px;
  box-sizing: border-box;
}

.create-button:hover {
  background: #292929;
}
</style>
