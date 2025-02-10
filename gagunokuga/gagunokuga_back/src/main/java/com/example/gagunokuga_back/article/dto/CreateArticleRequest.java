package com.example.gagunokuga_back.article.dto;

import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor  // 기본 생성자 추가 (필수)
@ToString
public class CreateArticleRequest {
    private String title;
    private String content;
    private String nickname;
    private List<String> articleImages;
}
