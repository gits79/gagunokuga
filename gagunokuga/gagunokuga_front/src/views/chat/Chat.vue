<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue";
import { useRoute } from 'vue-router';
import { useLoginStore } from "@/views/login/login"; // 로그인 스토어 가져오기
import { useEditorStore } from '../editor/editorStore';
import { useChatStore } from "./chat.js";
import { useFurnitureEditorStore } from "../editor/furniture-editor/furnitureEditorStore.js";
const furnitureEditorStore = useFurnitureEditorStore();
const store = useChatStore();
const route = useRoute();
const editorStore = useEditorStore();

const loginStore = useLoginStore(); // 로그인 스토어 초기화
const roomId = ref("1");
const nickname = computed(() => loginStore.state.nickname); // 로그인된 사용자의 닉네임 사용
const messageInput = ref("");
const chatLogs = ref([]);
let stompClient = null;
const chatBoxRef = ref(null); //  스크롤 자동 이동을 위한 ref
const inputRef = ref(null);


// 채팅창 상태 관리
const isOpen = ref(false);
const unreadCount = ref(0);
const isDragging = ref(false);
const isMinimized = ref(true); 
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

const handleKeyDown = (e) => {
  if(e.key === ' ') {
    e.preventDefault();
    messageInput.value += ' ';

    //커서 위치 끝으로 이동
    nextTick(() => {
      const length = messageInput.value.length;
      inputRef.value.setSelectionRange(length, length);
    });
  }
}

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
  const logs = await store.fetchChatLogs();

  if (Array.isArray(logs.chats)) {
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

  store.publishChatMessage(chatMessage);
  messageInput.value = "";

  scrollToBottom();
};

//  WebSocket으로 메시지 수신 처리 (과거 채팅 + 실시간 채팅 모두 반영)
const handleMessageReceived = (message) => {

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
  await store.initializeWebSocket(route.params.roomId);
  await store.subscribeToChat(handleMessageReceived);
  await loadChatLogs();
  await fetchNickname();
  furnitureEditorStore.fetchFurnitureList();
});

//  WebSocket 연결 해제
onUnmounted(() => {
  // store.unsubscribeFromChat();
 // 이벤트 리스너들을 정리
 document.removeEventListener('mousemove', resize);
  document.removeEventListener('mouseup', stopResize);
});
</script>

<template>
   <!-- 최소화된 채팅 버튼 -->
   <div v-if="isMinimized" class="chat-toggle" @click="toggleChat">
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      class="chat-icon"
    >
      <path 
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.663 3.04094 17.0829 4.73812 18.875L2.72681 21.1705C2.44361 21.4937 2.67314 22 3.10288 22H12Z" 
        fill="currentColor"
      />
      <circle cx="7" cy="12" r="1.5" fill="white"/>
      <circle cx="12" cy="12" r="1.5" fill="white"/>
      <circle cx="17" cy="12" r="1.5" fill="white"/>
    </svg>
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
        ref= "inputRef"
        v-model="messageInput" 
        type="text" 
        placeholder="메시지 입력" 
        class="input-field message-input" 
        @keydown.enter="sendChatMessage"
        @keydown="handleKeyDown"
      />
      <button @click="sendChatMessage" class="send-button">전송</button>
    </div>
  </div>
</template>

<style scoped src="./chat.css"></style>
