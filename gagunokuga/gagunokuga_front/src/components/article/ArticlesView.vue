<template>
  <div>
    <h1>게시판</h1>
    <div v-if="loading" class="loading-indicator">로딩 중...</div>
    <div v-for="post in posts" :key="post.id" class="post-item">
      <h3>{{ post.title }}</h3>
      <p>{{ post.content }}</p>
      <button @click="viewPost(post.id)">자세히 보기</button>
    </div>
    <button @click="loadPosts" v-if="!loading">더 보기</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      posts: [],
      loading: false,
      page: 1,
      pageSize: 10,
    };
  },
  created() {
    this.loadPosts();
  },
  methods: {
    async loadPosts() {
      if (this.loading) return;
      this.loading = true;

      // 실제 API 요청 예시
      const response = await fetch(`/articles?page=${this.page}&size=${this.pageSize}`);
      const data = await response.json();

      this.posts.push(...data.posts);  // 새로 로드된 게시글을 기존 게시글 목록에 추가
      this.page++;
      this.loading = false;
    },
    viewPost(postId) {
      this.$router.push(`/board/${postId}`);  // 게시글 상세 페이지로 이동
    },
  },
};
</script>

<style scoped>
.loading-indicator {
  text-align: center;
  font-size: 18px;
  margin: 20px 0;
}
.post-item {
  margin: 15px 0;
  padding: 10px;
  border: 1px solid #ddd;
}
</style>
