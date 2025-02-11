<template>
    <div class="article-detail-container">
      <!-- 제목 -->
      <h1 class="article-title">{{ store.article.title }}</h1>
  
      <!-- 이미지 리스트 -->
      <div class="image-gallery">
        <img v-for="(image, index) in store.article.articleImages" 
             :key="index" 
             :src="image.imageUrl" 
             class="article-image" 
             alt="Article image" />
      </div>
      
      <!-- 본문 내용 -->
      <div class="article-content">{{ store.article.content }}</div>
      
      <!-- 날짜 및 통계 정보 -->
      <div class="article-meta">
          <span>{{ formattedDate }}</span>
      </div>

      <!-- 작성자 정보 및 팔로우 버튼 -->
        <div class="author-section">
            <div class="author-info">
                <img :src="store.article.profileImageUrl ? store.article.profileImageUrl : '/default_profile.png'" 
                    class="author-image" 
                    alt="profile_image" />
                <div class="author-details">
                <span class="author-name">{{ store.article.nickname }}</span>
                </div>
            </div>
            <!-- <div class="action-buttons">
                <button class="follow-button">팔로우</button>
                <button class="report-button">신고하기</button>
            </div> -->
        </div>
  
      <!-- 좋아요 및 공유 버튼 -->
      <!-- <div class="article-actions">
        <button class="like-button">❤️ 좋아요</button>
        <button class="share-button">🔗 공유</button>
      </div> -->

    </div>
  </template>

<script setup>
import { onMounted, computed } from 'vue';
import { useArticleStore } from './articleStore';
import { useRoute } from 'vue-router';

const route = useRoute();
const store = useArticleStore();

// 날짜 형식 변환 (YYYY.MM.DD)
const formattedDate = computed(() => {
  if (!store.article.createdAt) return "";
  const date = new Date(store.article.createdAt);
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
});

onMounted(() => {
    store.getArticle(route.params.articleId);
});

</script>

<style scoped>
@import "./articleDetail.css";

</style>