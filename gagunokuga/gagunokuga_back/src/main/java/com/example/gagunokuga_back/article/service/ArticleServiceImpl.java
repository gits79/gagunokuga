package com.example.gagunokuga_back.article.service;

import com.example.gagunokuga_back.article.domain.Article;
import com.example.gagunokuga_back.article.domain.ArticleImage;
import com.example.gagunokuga_back.article.dto.ArticleListResponse;
import com.example.gagunokuga_back.article.dto.ArticleResponse;
import com.example.gagunokuga_back.article.dto.CreateArticleRequest;
import com.example.gagunokuga_back.article.repository.ArticleImageRepository;
import com.example.gagunokuga_back.article.repository.ArticleRepository;
import com.example.gagunokuga_back.image.service.ImageService;
import com.example.gagunokuga_back.user.domain.User;
import com.example.gagunokuga_back.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final ImageService imageService;
    private final ArticleImageRepository articleImageRepository;

    // 게시물 등록
    @Override
    public ArticleResponse createArticle(CreateArticleRequest request, List<MultipartFile> images) throws IOException {
        User user = userRepository.findByNickname(request.getNickName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // 게시물 db 등록
        Article savedArticle = articleRepository.save(
                Article.builder()
                        .title(request.getTitle())
                        .content(request.getContent())
                        .user(user)
                        .build()
        );

        List<ArticleImage> articleImages = new ArrayList<>();

        // S3 이미지 업로드
        for(MultipartFile image : images) {
                String url = imageService.uploadImage(image);
                // 이미지 주소 db 등록
                ArticleImage articleImage = articleImageRepository.save(
                    ArticleImage.builder()
                            .imageUrl(url)
                            .article(savedArticle)
                            .build()
                );

                articleImages.add(articleImage);
        }

        savedArticle.setArticleImages(articleImages);

        return ArticleResponse.fromEntity(savedArticle);

    }

    // 전체 게시물 조회
    @Override
    public ArticleListResponse getArticleList(int page) {
        int size = 20; // 한 페이지에 20개씩
        Pageable pageable = PageRequest.of(page, size);

        Page<Article> articlePage = articleRepository.findAll(pageable);

        List<ArticleResponse> articles = new ArrayList<>();

        // 현재 페이지의 데이터만 가져옴
        for(Article article : articlePage.getContent()) {
            articles.add(ArticleResponse.fromEntity(article));
        }

        return ArticleListResponse.builder()
        // totalPages : (현재) DB에 저장된 전체 데이터 개수 -> 나중에 필요시 수정!
                .totalPages((long) articlePage.getTotalElements())
                .articles(articles)
                .build();
    }

    // 게시물 상세 조회
    @Override
    public ArticleResponse getArticleById(Long articleId) {
        Optional<Article> article = articleRepository.findById(articleId);

        return article.map(ArticleResponse::fromEntity).orElse(null);
    }
    // 게시물 수정

    // 게시물 삭제
    @Override
    public void deleteArticle(Long articleId) {
        articleRepository.deleteById(articleId);
    }



}
