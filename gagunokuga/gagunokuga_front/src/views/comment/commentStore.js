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
      console.log(" API 응답 데이터:", response.data);

      //  Vue의 반응성을 유지하기 위해 새로운 배열을 할당
      comments.value = [...response.data.comments];

      console.log(" comments.value 업데이트됨:", comments.value);
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

      console.log(" 댓글 작성 완료:", response.data);
    } catch (error) {
      console.error(" 댓글 작성 중 오류 발생:", error);
      throw error;
    }
  };

  //  댓글 수정하기
  const updateComment = async (articleId, commentId, updatedContent) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(
        `${baseURL}/api/articles/${articleId}/comments/${commentId}`,
        { content: updatedContent },
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      //  수정된 댓글을 comments 배열에서 업데이트
      const commentIndex = comments.value.findIndex(comment => comment.id === commentId);
      if (commentIndex !== -1) {
        comments.value[commentIndex].content = updatedContent;
      }

      console.log(" 댓글 수정 완료:", response.data);
    } catch (error) {
      console.error(" 댓글 수정 중 오류 발생:", error);
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
      console.log(` 댓글 삭제 완료 (ID: ${commentId})`);
    } catch (error) {
      console.error(" 댓글 삭제 중 오류 발생:", error);
    }
  };

  return {
    comments,
    fetchComments,
    createComment,
    updateComment, //  댓글 수정 기능 추가
    deleteComment
  };
});
