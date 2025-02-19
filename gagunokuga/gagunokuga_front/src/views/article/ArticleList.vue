<template>
  <div class="container">
    <div class="create-button" @click="handleCreateArticle">✒️</div>
    <div class="grid-container">
      <div v-for="article in store.articleList.articles" :key="article.id" class="card">
        <router-link :to="'/article/' + article.id" class="card-link">
          <div class="image-container">
            <img :src="article.articleImages[0]?.imageUrl" alt="article_thumbnail" class="thumbnail" />
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ article.title }}</h3>
            <div class="author-info">
              <img :src="article.profileImageUrl"
                alt="profile_image" class="profile-image" />
              <span class="author-name">{{ article.nickname }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useArticleStore } from './articleStore';
import router from '../../router';

const store = useArticleStore();

onMounted(() => {
  store.getArticleList();
});

const handleCreateArticle = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    router.push('/login');
  } else {
    router.push('/article/create');
  }
};
</script>

<style scoped>
@import "./articleList.css";
</style>
