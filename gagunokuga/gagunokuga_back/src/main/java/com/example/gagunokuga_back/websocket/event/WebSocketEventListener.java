package com.example.gagunokuga_back.websocket.event;

import com.example.gagunokuga_back.websocket.service.WebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {
    private final WebSocketService webSocketService;

    @EventListener
    public void handleSessionSubscribe(SessionSubscribeEvent event) {   // 구독 시 호출
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String destination = headerAccessor.getDestination();
        String[] destinations = destination.split("/");
        String roomId = destinations[destinations.length - 1];
        String subscribeType = destinations[destinations.length - 2];
        if (subscribeType.equals("rooms")) {
            webSocketService.addSubscription(sessionId, roomId);
        }

    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) { // 연결 해제 시 호출
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        webSocketService.removeSubscription(sessionId);
    }
}
