package com.example.gagunokuga_back.chat.service;

import com.example.gagunokuga_back.chat.domain.Chat;
import com.example.gagunokuga_back.chat.dto.ChatListResponse;
import com.example.gagunokuga_back.chat.dto.ChatRequest;
import com.example.gagunokuga_back.chat.dto.ChatResponse;
import com.example.gagunokuga_back.chat.repository.ChatRepository;
import com.example.gagunokuga_back.user.domain.User;
import com.example.gagunokuga_back.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    @Override
    public ChatListResponse getChatList(Long roomId) {
        List<Chat> chats = chatRepository.findAllByRoomId(roomId);

        List<ChatResponse> list = new ArrayList<>();

        for(Chat chat : chats){
            list.add(ChatResponse.builder()
                            .id(chat.getId())
                            .content(chat.getContent())
                            .roomId(chat.getRoomId())
                            .userId(chat.getUser().getId())
                            .nickName(chat.getUser().getNickname())
                            .profileImageUrl(chat.getUser().getProfileImageUrl())
                            .build());
        }

        return ChatListResponse.builder()
                .chats(list)
                .build();
    }

    public ChatResponse sendMessage(ChatRequest chatMessage) {
        // User 객체를 userId로 조회
        User user = userRepository.findById(chatMessage.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 채팅 db 저장
        Chat chat = chatRepository.save(
                Chat.builder()
                        .roomId(chatMessage.getRoomId())
                        .user(user)
                        .content(chatMessage.getContent())
                        .build()
        );

        // 채팅 반환
        ChatResponse response = ChatResponse.builder()
                .id(chat.getId())
                .content(chat.getContent())
                .roomId(chat.getRoomId())
                .userId(chat.getUser().getId())
                .nickName(chat.getUser().getNickname())
                .profileImageUrl(chat.getUser().getProfileImageUrl())
                .build();

        return response;
    }

}