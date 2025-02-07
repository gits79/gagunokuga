package com.example.gagunokuga_back.article.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor  // 기본 생성자 추가 (필수)
@AllArgsConstructor // 모든 필드 생성자 (선택)
@ToString
public class CreateArticleRequest {
    private String title;
    private String content;
    private String nickName;
    private List<String> articleImages;
}
