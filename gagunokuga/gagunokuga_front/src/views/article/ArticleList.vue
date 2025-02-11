<template>
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="article in store.articleList.articles" :key="article.id" 
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <router-link :to="'/article/' + article.id" class="block">
          <img :src="article.articleImages[0]?.imageUrl" alt="article_thumbnail" 
            class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105" />
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 truncate">{{ article.title }}</h3>
            <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ article.content }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useArticleStore } from './articleStore';

const store = useArticleStore();

onMounted(() => {
  store.getArticleList();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
