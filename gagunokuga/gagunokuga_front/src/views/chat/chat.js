import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "@/api/axiosInstance";
import { subscribe, unsubscribe, publish } from '@/utils/stompClient';

export const useChatStore = defineStore('chatStore', () => {
  const stompClient = ref(null);
  const roomId = ref(null);//  채팅 기록 가져오기 (REST API, GET 요청)

  const fetchChatLogs = async () => {
    try {
      const response = await apiClient.get(`/api/rooms/${roomId.value}/chats`);
      
      console.log(" 채팅 기록 응답:", response.data);
      return response.data; //  채팅 목록이 포함된 전체 응답 반환
    } catch (error) {
      console.error(" 채팅 기록 불러오기 실패:", error);
      return { chats: [] }; //  빈 배열 반환
    }
  };
  const initializeWebSocket = async (id) => {
    roomId.value = id;
    if (!stompClient.value) {
      stompClient.value = true; // WebSocket 초기화 로직 (필요하면 연결 설정)
    }
  };

  const subscribeToChat = async (callback) => {
    const subPath = `/sub/chat/${roomId.value}`; 
    subscribe(subPath, callback);
  }

  const unsubscribeFromChat = () => {
    const subPath = `/sub/chat/${roomId.value}`;
    unsubscribe(subPath, false);
  }

  const publishChatMessage = (data) => {
    const pubPath = `/pub/chat/${roomId.value}`;
    publish(pubPath, data);
  }

  return {
    roomId,
    stompClient,
    fetchChatLogs,
    initializeWebSocket,
    subscribeToChat,
    unsubscribeFromChat,
    publishChatMessage,

  };
});
