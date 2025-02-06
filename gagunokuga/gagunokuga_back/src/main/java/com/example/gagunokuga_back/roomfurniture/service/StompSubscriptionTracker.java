package com.example.gagunokuga_back.roomfurniture.service;

import com.example.gagunokuga_back.roomfurniture.domain.RoomFurniture;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@RequiredArgsConstructor
public class StompSubscriptionTracker {
    private final ConcurrentHashMap<String, AtomicInteger> topicSubscribers = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> subscriptionDestinations = new ConcurrentHashMap<>();
    private final RoomFurnitureService roomFurnitureService;
    private final SimpMessageSendingOperations template;

    @EventListener
    public void handleSubscribeEvent(SessionSubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String subscriptionId = headerAccessor.getSubscriptionId();
        String destination = headerAccessor.getDestination();

        if (destination != null) {
            topicSubscribers.computeIfAbsent(destination, key -> new AtomicInteger(0)).incrementAndGet();
            subscriptionDestinations.put(subscriptionId, destination);
            System.out.println("Subscribed to: " + destination + " (Total: " + topicSubscribers.get(destination) + ")");
        }

        Long roomId = Long.parseLong(destination.split("/")[3]);

        String sessionId = headerAccessor.getSessionId();
        if (topicSubscribers.get(destination).get() == 1) {
            roomFurnitureService.loadAll(roomId);
//            for (RoomFurniture roomFurniture : roomFurnitureService.fetchAll(roomId)) {
//                template.convertAndSend(destination, roomFurniture);
//            }
        }
    }

    @EventListener
    public void handleUnsubscribeEvent(SessionUnsubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String subscriptionId = headerAccessor.getSubscriptionId();
        String destination = subscriptionDestinations.remove(subscriptionId);
        System.out.println(headerAccessor.toString());

        if (destination != null) {
            AtomicInteger remainingSubscriber = topicSubscribers.get(destination);
            if (remainingSubscriber != null && remainingSubscriber.decrementAndGet() <= 0) {
                Long roomId = Long.parseLong(destination.split("/")[3]);
                roomFurnitureService.saveAll(roomId);
                topicSubscribers.remove(destination);
            }
            System.out.println("Unsubscribed from: " + destination + " (Remaining: " + (remainingSubscriber != null ? remainingSubscriber.get() : 0) + ")");
        }
    }

    public int getSubscriberCount(String topic) {
        return topicSubscribers.getOrDefault(topic, new AtomicInteger(0)).get();
    }
}
