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


// 채팅창 상태 관리
const isOpen = ref(false);
const unreadCount = ref(0);
const isDragging = ref(false);
const isMinimized = ref(true); // 새로운 상태 추가
const startX = ref(0);
const startY = ref(0);
const startWidth = ref(300);
const startHeight = ref(400);
const chatWidth = ref(300);
const chatHeight = ref(400);

// 채팅창 토글 수정
const toggleChat = () => {
  if (isMinimized.value) {
    isMinimized.value = false;
    isOpen.value = true;
  } else {
    isMinimized.value = true;
    isOpen.value = false;
  }
  
  if (isOpen.value) {
    unreadCount.value = 0;
    nextTick(() => {
      scrollToBottom();
    });
  }
};

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

  if (!isOpen.value) {
    unreadCount.value++;
  }

  scrollToBottom();
};

// 닉네임을 가져오는 함수
const fetchNickname = async () => {
  await loginStore.fetchUserInfo(); // 사용자 정보 가져오기
};


// 리사이즈 관련 함수들
const startResize = (e) => {
  e.preventDefault(); // 기본 동작 방지
  isDragging.value = true;
  startX.value = e.clientX;
  startY.value = e.clientY;
  startWidth.value = chatWidth.value;
  startHeight.value = chatHeight.value;
  
  document.addEventListener('mousemove', resize, { passive: true });
  document.addEventListener('mouseup', stopResize);
};

const resize = (e) => {
  if (!isDragging.value) return;
  
  // requestAnimationFrame을 사용하여 리사이즈 성능 최적화
  requestAnimationFrame(() => {
    const deltaX = e.clientX - startX.value;
    const deltaY = e.clientY - startY.value;
    
    chatWidth.value = Math.min(Math.max(startWidth.value - deltaX, 250), 500);
    chatHeight.value = Math.min(Math.max(startHeight.value - deltaY, 300), 600);
  });
};

const stopResize = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', resize);
  document.removeEventListener('mouseup', stopResize);
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
 // document에 남아있을 수 있는 이벤트 리스너들을 정리
 document.removeEventListener('mousemove', resize);
  document.removeEventListener('mouseup', stopResize);
});
</script>

<template>
   <!-- 최소화된 채팅 버튼 -->
   <div v-if="isMinimized" class="chat-toggle" @click="toggleChat">
    <span class="chat-icon">💬</span>
    <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
  </div>
  
  <!-- 채팅창 -->
  <div 
    v-show="isOpen" 
    class="chat-container" 
    :style="{ 
      width: `${chatWidth}px`, 
      height: `${chatHeight}px`,
      display: isOpen ? 'flex' : 'none'
    }"
    :data-resizing="isDragging"
  >

    <!-- header -->
    <div class="chat-header">
      <h2>채팅</h2>
      <div class="header-controls">
        <button class="minimize-button" @click="toggleChat">─</button>
      </div>
    </div>

    <!-- 리사이즈 핸들 -->
    <div 
      class="resize-handle" 
      @mousedown.prevent="startResize"
    ></div>

    <!-- message -->
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

    <!-- input -->
    <div class="chat-input">
      <input 
        v-model="messageInput" 
        type="text" 
        placeholder="메시지 입력" 
        class="input-field message-input" 
        @keydown.enter="sendChatMessage"
      />
      <button @click="sendChatMessage" class="send-button">전송</button>
    </div>
  </div>
</template>

<style scoped src="./chat.css"></style>
