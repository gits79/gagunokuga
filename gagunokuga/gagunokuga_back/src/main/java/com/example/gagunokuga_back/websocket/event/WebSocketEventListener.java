package com.example.gagunokuga_back.websocket.event;

import com.example.gagunokuga_back.websocket.service.WebSocketSubscriberService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {
    private final WebSocketSubscriberService subscriberService;

    @EventListener
    public void handleSessionSubscribe(SessionSubscribeEvent event) {   // 구독 시 호출
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String destination = headerAccessor.getDestination();
        String roomId = destination.replace("/sub/rooms/", ""); // 구독 path 에서 roomId 값만 추출

        subscriberService.addSubscription(sessionId, roomId);
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) { // 연결 해제 시 호출
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        subscriberService.removeSubscription(sessionId);
    }
}
