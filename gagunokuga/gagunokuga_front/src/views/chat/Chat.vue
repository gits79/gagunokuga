<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue";
import { useLoginStore } from "@/views/login/login"; // 로그인 스토어 가져오기
import {
  fetchChatLogs,
  connectWebSocket,
  sendMessage,
  disconnectWebSocket,
} from "./chat.js";

const loginStore = useLoginStore(); // 로그인 스토어 초기화
const roomId = ref("1");
const nickname = computed(() => loginStore.state.nickname); // 로그인된 사용자의 닉네임 사용
const messageInput = ref("");
const chatLogs = ref([]);
let stompClient = null;
const chatBoxRef = ref(null); //  스크롤 자동 이동을 위한 ref

//  채팅창 자동 스크롤 함수
const scrollToBottom = () => {
  nextTick(() => {
    if (chatBoxRef.value) {
      chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight;
    }
  });
};

//  기존 채팅 기록 불러오기 (API 사용)
const loadChatLogs = async () => {
  const logs = await fetchChatLogs(roomId.value);
  console.log("닉네임",nickname.value)
  console.log(" 과거 채팅 기록:", logs);

  if (Array.isArray(logs.chats)) {
    console.log("로그",logs.chats)
    chatLogs.value = logs.chats.map(chat => ({
      nickname: chat.nickname,
      content: chat.content,
      // time: new Date().toLocaleTimeString("ko-KR", {
      //   hour: "2-digit",
      //   minute: "2-digit",
      //   hour12: false,
      // }),
      time: new Date(chat.createdAt).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
      profileImageUrl: chat.profileImageUrl || "",
    }));
    scrollToBottom();
  }
};

// 메시지 전송 (WebSocket만 사용)
const sendChatMessage = async () => {
  if (!messageInput.value.trim()) return;
  if (!nickname.value.trim()) {
    alert(" 닉네임을 입력해주세요!");
    return;
  }

  const chatMessage = {
    roomId: Number(roomId.value),
    nickname: nickname.value,
    content: messageInput.value,
  };

  console.log(" 전송할 메시지:", chatMessage);

  sendMessage(roomId.value, chatMessage);
  messageInput.value = "";

  scrollToBottom();
};

//  WebSocket으로 메시지 수신 처리 (과거 채팅 + 실시간 채팅 모두 반영)
const handleMessageReceived = (message) => {
  console.log(" 실시간 메시지 수신:", message);

  if (!message.nickname) {
    console.error(" nickname이 없음!", message);
    return;
  }

  chatLogs.value.push({
    nickname: message.nickname,
    content: message.content,
    time: new Date().toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    profileImageUrl: message.profileImageUrl || "",
  });

  scrollToBottom();
};

// 닉네임을 가져오는 함수
const fetchNickname = async () => {
  await loginStore.fetchUserInfo(); // 사용자 정보 가져오기
};

//  WebSocket 연결 및 기존 채팅 기록 불러오기
onMounted(async () => {
  await loadChatLogs();
  await fetchNickname();
  stompClient = connectWebSocket(roomId.value, handleMessageReceived);
});

//  WebSocket 연결 해제
onUnmounted(() => {
  disconnectWebSocket();
});
</script>

<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>채팅놓구가</h2>
      <button class="close-button">✖</button>
    </div>

    <div ref="chatBoxRef" class="chat-box">
      <div
        v-for="(msg, index) in chatLogs"
        :key="index"
        class="chat-message"
        :class="{ 'my-message': msg.nickname === nickname }"
      >
        <div v-if="msg.nickname !== nickname" class="profile-container">
          <img v-if="msg.profileImageUrl" :src="msg.profileImageUrl" class="profile-image" />
        </div>

        <div class="message-content">
          <div v-if="msg.nickname !== nickname" class="nickname">{{ msg.nickname }}</div>
          <div class="message-text">{{ msg.content }}</div>
        </div>

        <div class="message-time">{{ msg.time }}</div>
      </div>
    </div>

    <div class="chat-input">
      <input 
        v-model="messageInput" 
        type="text" 
        placeholder="메시지 입력" 
        class="input-field message-input" 
        @keyup.enter="sendChatMessage"
      />
      <button @click="sendChatMessage" class="send-button">전송</button>
    </div>
  </div>
</template>

<style scoped src="./chat.css"></style>
