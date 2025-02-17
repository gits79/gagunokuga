<template>
  <div class="article-detail-container">
    <!-- 옵션 메뉴 (로그인한 사용자가 작성자일 경우) -->
    <div v-if="isAuthor" class="article-options">
      <button @click="toggleMenu" class="menu-button">⋯</button>
      <div v-if="showMenu" class="menu-dropdown">
        <button @click="editArticle">수정하기</button>
        <button @click="deleteArticle" class="delete-button">삭제하기</button>
      </div>
    </div>

    <!-- 작성자 정보 및 날짜 한 줄 정렬 -->
    <div class="author-meta">
      <div class="author-info">
        <img :src="store.article.profileImageUrl" class="author-image" alt="profile_image" />
        <span class="author-name">{{ store.article.nickname }}</span>
      </div>
      <span class="article-date">{{ formattedDate }}</span>
    </div>

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
    
    <!-- 댓글 추가 -->
    <Comment :articleId="route.params.articleId" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useArticleStore } from './articleStore';
import { useLoginStore } from '../login/login';
import { useRoute, useRouter } from 'vue-router';
import Comment from '../comment/Comment.vue'; // 댓글 컴포넌트

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