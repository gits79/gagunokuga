<template>
    <div class="article-detail-container">
      <!-- 메인 이미지 -->
      <!-- <div class="main-image-container"> -->
        <!-- <img :src="store.article.articleImages[0].imageUrl" alt="Main article image" class="main-image" /> -->
      <!-- </div> -->
      
      <!-- 이미지 리스트 -->
      <div class="image-gallery" v-for="(image, index) in store.article.articleImages" :key="index">
        <img :src="image.imageUrl" class="article-image" alt="Article image" />
      </div>
      
      <!-- 제목 및 작성자 정보 -->
      <div class="article-header">
        <h1 class="article-title">{{ store.article.title }}</h1>
        <div class="author-info">
          <img :src="store.article.profileImageUrl ? store.article.profileImageUrl : '/default_profile.png'" class="author-image" alt="profile_image" />
          <span class="author-name">{{ store.article.nickname }}</span>
          <span class="article-date">{{ store.article.createdAt }}</span>
        </div>
      </div>
  
      <!-- 본문 내용 -->
      <div class="article-content">{{ store.article.content }}</div>
  
  
      <!-- 좋아요 및 공유 버튼 -->
      <div class="article-actions">
        <button class="like-button">❤️ 좋아요</button>
        <button class="share-button">🔗 공유</button>
      </div>
    </div>    
</template>

<script setup>
import { onMounted } from 'vue';
import { useArticleStore } from './articleStore';
import { useRoute } from 'vue-router';

const route = useRoute();
const store = useArticleStore();

console.log(route.params.articleId);
console.log(store.article);

onMounted(() => {
    store.getArticle(route.params.articleId);
});

</script>

<style scoped>
@import "./articleDetail.css";

</style>