package com.example.gagunokuga_back.websocket.service;

import com.example.gagunokuga_back.roomfurniture.service.RoomFurnitureService;
import com.example.gagunokuga_back.websocket.dto.FurnitureEventDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketService {

    private final RedisTemplate<String, String> redisTemplate;  // sessionId:roomId, roomId:subCount 형식으로 저장
    private final RoomFurnitureService roomFurnitureService;

    private static final String SESSION_PREFIX = "session:";
    private static final String CHANNEL_PREFIX = "channel:";

    public void addSubscription(String sessionId, String roomId) {
        redisTemplate.opsForValue().set(SESSION_PREFIX + sessionId, roomId);
        System.out.println("Session " + sessionId + " has subscribed to " + roomId);
        incrementSubscriberCount(roomId);
    }

    public void removeSubscription(String sessionId) {
        if (redisTemplate.opsForValue().get(SESSION_PREFIX + sessionId) != null) {
            String roomId = redisTemplate.opsForValue().get(SESSION_PREFIX + sessionId);
            System.out.println("Session " + sessionId + " has removed " + roomId);
            redisTemplate.delete(SESSION_PREFIX + sessionId);
            decrementSubscriberCount(roomId);
        } else {
            System.out.println("Session " + sessionId + " has no subscribers left.");
        }
    }

    private void incrementSubscriberCount(String roomId) {
        Long subscriberCount = redisTemplate.opsForValue().increment(CHANNEL_PREFIX + roomId, 1);
        System.out.println("Channel " + roomId + " has " + subscriberCount + " subscribers.");
        if (subscriberCount == 1) { // 룸에 첫 구독자 발생 시 Redis 메모리에 캐싱
            roomFurnitureService.loadAll(Long.parseLong(roomId));
        }
    }

    private void decrementSubscriberCount(String roomId) {
        Long subscriberCount = redisTemplate.opsForValue().decrement(CHANNEL_PREFIX + roomId, 1);
        System.out.println("Channel " + roomId + " has " + subscriberCount + " subscribers.");
        if (subscriberCount == 0) { // 룸에서 마지막 구독자 연결 해제 시 캐싱 된 데이터를 DB 저장
            roomFurnitureService.saveAll(Long.parseLong(roomId));
        }
    }

    public void receiveFurnitureEvent(Long roomId, FurnitureEventDto furnitureEventDto) {
        roomFurnitureService.store(roomId, furnitureEventDto.getFurniture());
    }
}
