package com.example.gagunokuga_back.comment.dto;

import com.example.gagunokuga_back.article.domain.Article;
import com.example.gagunokuga_back.comment.domain.Comment;
import com.example.gagunokuga_back.user.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Getter
@Builder
public class CommentRequest {
    private String content;
    private Long userId;
    private Long articleId;

    public Comment toEntity(Article article, User user) {
        return Comment.builder()
                .content(content)
                .article(article)
                .user(user)
                .build();
    }

}
