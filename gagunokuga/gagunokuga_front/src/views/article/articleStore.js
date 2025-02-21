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
            article.value = response.data;
            return article.value;
        } catch (error) {
            console.error(error);
        }
    }

    // 게시글 작성
    const createArticle = async (formData) => {
        try {
            const response = await axios.post(`${baseURL}/api/articles`, formData, {
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

    // 게시글 수정
    const updateArticle = async (articleId, formData) => {
        try {
            const response = await axios.put(`${baseURL}/api/articles/${articleId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('게시글이 수정되었습니다.');
            router.replace(`/article/${response.data.id}`);
            article.value = response.data;
            return article.value;
        } catch (error) {
            console.error(error);
        }
    }

    // 게시글 삭제
    const deleteArticle = async (articleId) => {
        try {
            await axios.delete(`${baseURL}/api/articles/${articleId}`);
            alert('게시글이 삭제되었습니다.');
            router.replace('/'); // 메인 페이지로 이동
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
    updateArticle,
    deleteArticle,
    
  }
})
