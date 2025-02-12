import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios, { Axios } from 'axios'
import router from '../../router';

const baseURL = import.meta.env.VITE_API_URL;

export const useArticleStore = defineStore('articleStore', () => {

    // 게시물 전체 목록
    const articleList = ref([]);
    const getArticleList = async () => {
        try {
            const response = await axios.get(`${baseURL}/articles`);
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
            const response = await axios.get(`${baseURL}/articles/${articleId}`);
            article.value = response.data;
            return article.value;
        } catch (error) {
            console.error(error);
        }
    }

    // 게시글 작성
    const createArticle = async (formData) => {
        try {
            const response = await axios.post(`${baseURL}/articles`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            router.replace(`/article/${response.data.id}`);
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
    article,
    createArticle,
    
  }
})
