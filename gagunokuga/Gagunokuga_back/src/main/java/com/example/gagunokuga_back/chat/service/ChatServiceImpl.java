package com.example.gagunokuga_back.chat.service;

import com.example.gagunokuga_back.chat.domain.Chat;
import com.example.gagunokuga_back.chat.dto.ChatListResponse;
import com.example.gagunokuga_back.chat.dto.CreateChatRequest;
import com.example.gagunokuga_back.chat.dto.ChatResponse;
import com.example.gagunokuga_back.chat.repository.ChatRepository;
import com.example.gagunokuga_back.room.domain.Room;
import com.example.gagunokuga_back.room.repository.RoomRepository;
import com.example.gagunokuga_back.user.domain.User;
import com.example.gagunokuga_back.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatServiceImpl implements ChatService {
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    @Override
    public ChatListResponse getChatList(Long roomId) {
        List<Chat> chats = chatRepository.findAllByRoomId(roomId);

        List<ChatResponse> list = new ArrayList<>();

        for(Chat chat : chats){
            list.add(ChatResponse.builder()
                            .id(chat.getId())
                            .content(chat.getContent())
                            .roomId(chat.getRoom().getId())
                            .nickName(chat.getUser().getNickname())
                            .profileImageUrl(chat.getUser().getProfileImageUrl())
                            .build());
        }

        return ChatListResponse.builder()
                .totalCount(chats.size()) // 일단 전체 size로 설정
                .chats(list)
                .build();
    }

    public ChatResponse sendMessage(CreateChatRequest chatMessage) {
        // User 객체를 nickName으로 조회
        User user = userRepository.findByNickname(chatMessage.getNickName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Room room = roomRepository.findById(chatMessage.getRoomId())
                .orElseThrow(() -> new EntityNotFoundException("Room not found"));

        // 채팅 db 저장
        Chat chat = chatRepository.save(
                Chat.builder()
                        .room(room)
                        .user(user)
                        .content(chatMessage.getContent())
                        .build()
        );

        // 채팅 반환
        ChatResponse response = ChatResponse.builder()
                .id(chat.getId())
                .content(chat.getContent())
                .roomId(chat.getRoom().getId())
                .nickName(chat.getUser().getNickname())
                .profileImageUrl(chat.getUser().getProfileImageUrl())
                .build();

        return response;
    }

}