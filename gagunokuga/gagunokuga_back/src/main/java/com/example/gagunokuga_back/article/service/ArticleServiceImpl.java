package com.example.gagunokuga_back.article.service;

import com.example.gagunokuga_back.article.domain.Article;
import com.example.gagunokuga_back.article.domain.ArticleImage;
import com.example.gagunokuga_back.article.dto.ArticleImageResponse;
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
import java.nio.file.AccessDeniedException;
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
            savedArticle.addImage(articleImage);
        }

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
    @Override
    public ArticleResponse updateArticle(Long articleId, CreateArticleRequest request, List<MultipartFile> newImages, List<Long> deleteList) throws AccessDeniedException {
        // 1. 게시글 조회
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new EntityNotFoundException("Article Not Found"));

        // 권한 체크
        if(!article.getUser().getNickname().equals(request.getNickName())) {
            throw new AccessDeniedException("Not owner of this article");
        }

        // 2. 게시글 수정
        article.update(request.getTitle(), request.getContent());

        // 3. 삭제할 이미지 처리
        if(deleteList != null && !deleteList.isEmpty()) {
            for(Long imageId : deleteList) {
                // 이미지 조회
                ArticleImage image = articleImageRepository.findById(imageId)
                        .orElseThrow(() -> new EntityNotFoundException("Image Not Found"));

                // s3에서 이미지 삭제
                imageService.deleteImage(image.getImageUrl());

                // article에서 이미지 삭제
                article.getArticleImages().remove(image);

                // db에서 이미지 삭제
                articleImageRepository.delete(image);
            }
        }

        // 4. 이미지 등록
        if(newImages != null && !newImages.isEmpty()) {
            for(MultipartFile image : newImages) {
                // s3에 업로드
                String imageUrl;
                try {
                    imageUrl = imageService.uploadImage(image);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }

                // 이미지 주소 db 등록
                ArticleImage articleImage = ArticleImage.builder()
                                .imageUrl(imageUrl)
                                .article(article)
                                .build();

                // JPA 관계 추가 (article에도 반영)
                article.getArticleImages().add(articleImage);

                articleImageRepository.save(articleImage);
            }
        }

        return ArticleResponse.fromEntity(article);
    }

    // 게시물 삭제
    @Override
    public void deleteArticle(Long articleId) {
        // s3에서도 이미지 삭제
        List<ArticleImage> images = articleImageRepository.findAllByArticleId(articleId);
        for(ArticleImage image : images) {
            imageService.deleteImage(image.getImageUrl());
        }

        articleRepository.deleteById(articleId);
    }



}
