<template>
    <!-- 두 번째 줄 (24개 박스) -->
    <div class="row grid grid-cols-4 gap-4 max-w-screen-lg w-full p-2">
      <div v-for="(article, index) in store.articleList.articles" :key="index" class="box bg-gray-300 flex justify-center items-center aspect-square w-full overflow-hidden">
        <div class="w-full h-full flex justify-center items-center">
          <div class="text-center">
            <div class="text-lg font-bold">{{ article.title }}</div>
            <div class="text-sm">{{ article.content }}</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
import { useArticleStore } from './articleStore';

    const store = useArticleStore();

    onMounted(() => {
        store.getArticleList();
    });

</script>

<style scoped>

</style>