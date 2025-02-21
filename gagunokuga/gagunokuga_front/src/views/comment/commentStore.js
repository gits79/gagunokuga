import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const useCommentStore = defineStore("commentStore", () => {
  const comments = ref([]);

  //  댓글 목록 가져오기
  const fetchComments = async (articleId) => {
    try {
      const response = await axios.get(`${baseURL}/api/articles/${articleId}/comments`);

      //  Vue의 반응성을 유지하기 위해 새로운 배열을 할당
      comments.value = [...response.data.comments];

    } catch (error) {
      console.error("❌ 댓글을 불러오는 중 오류 발생:", error);
    }
  };

  //  댓글 작성하기
  const createComment = async (articleId, content) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${baseURL}/api/articles/${articleId}/comments`,
        { content: content },
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      comments.value.push({
        id: response.data.id,
        content: response.data.content,
        createdAt: response.data.createdAt,
        nickname: response.data.nickname,
        profileImageUrl: response.data.profileImageUrl
      });

    } catch (error) {
      console.error(" 댓글 작성 중 오류 발생:", error);
      throw error;
    }
  };

  
  //  댓글 삭제하기
  const deleteComment = async (articleId, commentId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${baseURL}/api/articles/${articleId}/comments/${commentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      comments.value = comments.value.filter(comment => comment.id !== commentId);
    } catch (error) {
      console.error(" 댓글 삭제 중 오류 발생:", error);
    }
  };

  return {
    comments,
    fetchComments,
    createComment,
    deleteComment
  };
});
