<template>
  <div class="article-detail-container">

    <!-- 제목과 옵션 메뉴를 한 줄에 배치 -->
    <div class="article-header">
      <!-- 옵션 메뉴 (로그인한 사용자가 작성자일 경우) -->
      <div v-if="isAuthor" class="article-options">
        <div @click="toggleMenu" class="menu-button">
          <svg viewBox="0 0 15 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="6" r="5" fill="currentColor" />
            <circle cx="12" cy="20" r="5" fill="currentColor" />
            <circle cx="12" cy="34" r="5" fill="currentColor" />
          </svg>
        </div>
        <div v-if="showMenu" class="menu-dropdown">
          <button @click="editArticle" class="menu-item">수정하기</button>
          <button @click="deleteArticle" class="menu-item delete-button">삭제하기</button>
        </div>
      </div>
      <!-- 제목 -->
      <h1 class="article-title">{{ store.article.title }}</h1>
    </div>

    <!-- 작성자 정보 및 팔로우 버튼 -->
    <div class="author-section">
      <div class="author-info">
        <img :src="store.article.profileImageUrl" class="author-image" alt="profile_image" />
        <div class="author-details">
          <span class="author-name">{{ store.article.nickname }}</span>
        </div>
      </div>
      <!-- <div class="action-buttons">
          <button class="follow-button">팔로우</button>
          <button class="report-button">신고하기</button>
      </div> -->
    </div>

    <!-- 이미지 리스트 -->
    <div class="image-gallery">
      <img v-for="(image, index) in store.article.articleImages" :key="index" :src="image.imageUrl"
        class="article-image" alt="Article image" />
    </div>

    <!-- 본문 내용 -->
    <div class="article-content">{{ store.article.content }}</div>

    <!-- 날짜 및 통계 정보 -->
    <div class="article-meta">
      <span>{{ formattedDate }}</span>
    </div>

    <!-- 좋아요 및 공유 버튼 -->
    <!-- <div class="article-actions">
      <button class="like-button">❤️ 좋아요</button>
      <button class="share-button">🔗 공유</button>
    </div> -->

    <!-- ✅ 댓글 추가 -->
    <Comment :articleId="route.params.articleId" />

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useArticleStore } from './articleStore';
import { useLoginStore } from '../login/login';
import { useRoute, useRouter } from 'vue-router';
import Comment from '../comment/Comment.vue'; // 댓글 컴포넌트 추가

const route = useRoute();
const router = useRouter();
const store = useArticleStore();
const loginStore = useLoginStore();

const showMenu = ref(false);

// 현재 로그인한 사용자 정보
const currentUser = computed(() => loginStore.state.nickname);

// 현재 게시글 작성자와 로그인한 사용자가 동일한지 확인
const isAuthor = computed(() => store.article.nickname === currentUser.value);

// 날짜 형식 변환 (YYYY.MM.DD)
const formattedDate = computed(() => {
  if (!store.article.createdAt) return "";
  const date = new Date(store.article.createdAt);
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
});

// 메뉴 토글
const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

// 게시글 수정
const editArticle = () => {
  router.push(`/article/${route.params.articleId}/edit`);
};

// 게시글 삭제
const deleteArticle = async () => {
  if (confirm("정말 삭제하시겠습니까?")) {
    await store.deleteArticle(route.params.articleId);
  }
};

onMounted(() => {
  store.getArticle(route.params.articleId);
});
</script>

<style scoped>
@import "./articleDetail.css";
</style>
