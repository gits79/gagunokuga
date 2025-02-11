<template>
  <div class="container mx-auto p-4 flex justify-center">
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="article in store.articleList.articles" :key="article.id" 
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform transform hover:scale-105 w-72 h-auto">
        <router-link :to="'/article/' + article.id" class="block">
          <div class="overflow-hidden">
            <img :src="article.articleImages[0]?.imageUrl" alt="article_thumbnail" 
              class="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 truncate">{{ article.title }}</h3>
            <div class="flex items-center mt-2">
              <img :src="article.profileImageUrl ? article.profileImageUrl : 'src/assets/default_profile.png'" 
                alt="author_profile" class="w-6 h-6 rounded-full mr-2" />
              <span class="text-sm text-gray-600">{{ article.nickname }}</span>
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

const store = useArticleStore();

onMounted(() => {
  store.getArticleList();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
