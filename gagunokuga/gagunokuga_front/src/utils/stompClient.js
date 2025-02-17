import { Client } from '@stomp/stompjs';

const stompClient = new Client({
  brokerURL: import.meta.env.VITE_WS_URL,
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
});

let subscriptions = {}; // 각 구독을 track할 객체

stompClient.onConnect = () => {
  console.log('WebSocket Connected');
};

stompClient.onStompError = (frame) => {
  console.error('WebSocket Error:', frame);
};

// 구독 함수: subPath와 callback을 받아서 구독
export const subscribe = (subPath, callback) => {
    stompClient.onConnect = (frame) => {
        subscriptions[subPath] = stompClient.subscribe(subPath, (message) => {
            callback(JSON.parse(message.body));
        }).id;
    };
    stompClient.onStompError = (frame) => {
        console.error('WebSocket 에러:', frame);
    };
    console.log(subPath, "구독 성공")
    stompClient.activate();
};

// 구독 해제 함수
export const unsubscribe = (subPath) => {
  if (subscriptions[subPath]) {
    stompClient.unsubscribe(subscriptions[subPath]);
    delete subscriptions[subPath];
    stompClient.deactivate();
  }
};

// 발행 함수: pubPath로 메시지를 전송
export const publish = (pubPath, data) => {
  if (stompClient.connected) {
    stompClient.publish({
      destination: pubPath,
      body: JSON.stringify(data),
    });
    console.log(`Published to ${pubPath}`);
  }
};

export default stompClient;
