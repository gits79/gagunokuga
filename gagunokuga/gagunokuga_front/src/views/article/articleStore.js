import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios, { Axios } from 'axios'

const baseURL = import.meta.env.VITE_API_URL;

export const useArticleStore = defineStore('articleStore', () => {

    // 게시물 전체 목록
    const articleList = ref([]);
    const getArticleList = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/articles`);
            articleList.value = response.data;
            return articleList.value;
        } catch (error) {
            console.error(error);
        }
    }

    // 게시물 상세 조회
    const article = ref({});
    const getArticle = async (articleId) => {
        try {
            const response = await axios.get(`${baseURL}/api/articles/${articleId}`);
            console.log(response.data);
            article.value = response.data;
            return article.value;
        } catch (error) {
            console.error(error);
        }
    }
  

  return {
    articleList,
    getArticleList,
    getArticle,
    article
    
  }
})
