import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "@/api/axiosInstance";
import { subscribe, unsubscribe, publish } from '@/utils/stompClient';
import { useFurnitureEditorStore } from '../editor/furniture-editor/furnitureEditorStore';

export const useChatStore = defineStore('chatStore', () => {
  const furnitureEditorStore = useFurnitureEditorStore();
  const roomId = ref(null);//  채팅 기록 가져오기 (REST API, GET 요청)

  const fetchChatLogs = async () => {
    try {
      const response = await apiClient.get(`/api/rooms/${roomId.value}/chats`);
      
      return response.data; //  채팅 목록이 포함된 전체 응답 반환
    } catch (error) {
      console.error(" 채팅 기록 불러오기 실패:", error);
      return { chats: [] }; //  빈 배열 반환
    }
  };
  const initializeWebSocket = async (id) => {
    roomId.value = id;
  };

  const subscribeToChat = async (callback) => {
    furnitureEditorStore.subscribeToRoom(callback)
    // const subPath = `/sub/chat/${roomId.value}`; 
    // subscribe(subPath, callback); // 가구 테스트용 구독 임시 비활성화화
  }

  const unsubscribeFromChat = () => {
    const subPath = `/sub/chat/${roomId.value}`;
    unsubscribe(subPath);
  }

  const publishChatMessage = (data) => {
    const pubPath = `/pub/chat/${roomId.value}`;
    publish(pubPath, data);
  }

  return {
    roomId,
    fetchChatLogs,
    initializeWebSocket,
    subscribeToChat,
    unsubscribeFromChat,
    publishChatMessage,

  };
});
