import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios, { Axios } from 'axios'

const baseURL = import.meta.env.VITE_API_URL;

export const useArticleStore = defineStore('articleStore', () => {

    // 게시물 전체 목록
    const articleList = ref([]);
    const getArticleList = async () => {
        try {
            const response = await axios.get(`${baseURL}/articles`);
            articleList.value = response.data;
            console.log(articleList.value);
            return articleList.value;
        } catch (error) {
            console.error(error);
        }
    }
  

  return {
    articleList,
    getArticleList
    
  }
})
