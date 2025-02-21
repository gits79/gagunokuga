import { Client } from '@stomp/stompjs';

const stompClient = new Client({
  brokerURL: import.meta.env.VITE_WS_URL,
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
});

const subscriptions = {}; // 각 구독을 track할 객체

stompClient.onStompError = (frame) => {
  console.error('WebSocket Error:', frame);
};

// 구독 함수: subPath와 callback을 받아서 구독
export const subscribe = (roomId, callback1, callback2) => {
  let path1 = `/sub/rooms/${roomId}`;
  let path2 = `/sub/chat/${roomId}`;

  // 연결이 완료된 후 한 번만 구독을 설정
  stompClient.onConnect = () => {
    if (!subscriptions[path1]) { // 이미 구독이 되어 있지 않다면
      subscriptions[path1] = stompClient.subscribe(path1, (message) => {
        callback1(JSON.parse(message.body));
      }, { id: path1 });
    }

    if (!subscriptions[path2]) { // 이미 구독이 되어 있지 않다면
      subscriptions[path2] = stompClient.subscribe(path2, (message) => {
        callback2(JSON.parse(message.body));
      }, { id: path2 });
    }

  };

  // 연결 실패 시 에러 핸들러
  stompClient.onWebSocketError = (error) => {
    console.error('WebSocket 연결 오류:', error);
  };

  // 연결 시도
  stompClient.activate();
};

// 구독 해제 함수
export const unsubscribe = (roomId) => {
  let path1 = `/sub/rooms/${roomId}`;
  let path2 = `/sub/chat/${roomId}`;

  if (subscriptions[path1]) {
    subscriptions[path1].unsubscribe();
    delete subscriptions[path1]; // 구독 해제 후 관리 객체에서 제거
  }

  if (subscriptions[path2]) {
    subscriptions[path2].unsubscribe();
    delete subscriptions[path2];
  }

  stompClient.deactivate();
};

// 발행 함수: pubPath로 메시지를 전송
export const publish = (pubPath, data) => {
  if (stompClient.connected) {
    stompClient.publish({
      destination: pubPath,
      body: JSON.stringify(data),
    });
  }
};

export default stompClient;
