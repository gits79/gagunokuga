package com.example.gagunokuga_back.article.repository;

import com.example.gagunokuga_back.article.domain.ArticleImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArticleImageRepository extends JpaRepository<ArticleImage, Long> {
    List<ArticleImage> findAllByArticleId(Long articleId);
}
