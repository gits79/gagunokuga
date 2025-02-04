package com.example.gagunokuga_back.chat.domain;

import com.example.gagunokuga_back.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Messages")
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private Long roomId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
