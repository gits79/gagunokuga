package com.example.gagunokuga_back.comment.domain;

import com.example.gagunokuga_back.article.domain.Article;
import com.example.gagunokuga_back.common.BaseTimeEntity;
import com.example.gagunokuga_back.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@AllArgsConstructor
@ToString
@NoArgsConstructor
@Table(name = "comments")
public class Comment extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;


    public void update(String content) {
        this.content = content;
    }

}
