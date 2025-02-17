import { Client } from "@stomp/stompjs";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
let stompClient = null;

//  채팅 기록 가져오기 (REST API, GET 요청)
export const fetchChatLogs = async (roomId) => {
  try {
    console.log(` 채팅 기록 요청: GET ${API_BASE_URL}/api/rooms/${roomId}/chats`);
    const response = await axios.get(`${API_BASE_URL}/api/rooms/${roomId}/chats`);
    
    console.log(" 채팅 기록 응답:", response.data);
    return response.data; //  채팅 목록이 포함된 전체 응답 반환
  } catch (error) {
    console.error(" 채팅 기록 불러오기 실패:", error);
    return { chats: [] }; //  빈 배열 반환
  }
};

//  WebSocket 연결
export const connectWebSocket = (roomId, onMessageReceived) => {
  stompClient = new Client({
    brokerURL: `${API_BASE_URL.replace("http", "ws")}/ws/`,
    reconnectDelay: 5000, // 5초 후 자동 재연결
    onConnect: () => {
      console.log(" WebSocket 연결됨!");

      //  채팅방 구독 (모든 클라이언트가 동일한 방을 구독)
      stompClient.subscribe(`/sub/${roomId}`, (message) => {
        console.log(" 메시지 수신:", message.body);
        const response = JSON.parse(message.body);
        onMessageReceived(response);
      });
    },
    onDisconnect: () => console.log(" WebSocket 연결 해제됨"),
  });

  stompClient.activate();
};

//  메시지 전송 (WebSocket)
export const sendMessage = (roomId, chatMessage) => {
  if (stompClient && stompClient.connected) {
    console.log(" WebSocket으로 메시지 전송:", chatMessage);
    stompClient.publish({
      destination: `/pub/${roomId}`,
      body: JSON.stringify(chatMessage),
    });
  } else {
    console.error(" WebSocket이 연결되지 않았습니다.");
  }
};

//  WebSocket 연결 해제
export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    console.log(" WebSocket 연결 해제됨");
  }
};
