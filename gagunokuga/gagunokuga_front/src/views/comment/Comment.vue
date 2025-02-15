<template>
  <div class="comment-container">
    <h3>댓글 {{ comments?.length || 0 }}개</h3>

    <!-- 댓글 입력 (로그인한 경우) -->
    <div v-if="isLoggedIn" class="comment-form">
      <input v-model="newComment" placeholder="댓글을 입력하세요..." 
        @keyup.enter="submitComment"
      />
      <button @click="submitComment">댓글 작성</button>
    </div>

    <!-- ✅ 댓글 목록 -->
    <div v-if="comments?.length > 0">
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <div class="comment-header">
          <img :src="comment.profileImageUrl" class="comment-profile-image" alt="프로필 이미지" />
          <span class="comment-author">{{ comment.nickname }}</span>
          <span class="comment-date">{{ formatTimeAgo(comment.createdAt) }}</span>
        </div>

        <!-- ✅ 수정 모드일 때 -->
        <div v-if="editingCommentId === comment.id">
          <input v-model="editedContent" class="edit-input" />
          <button @click="saveEdit(comment.id)" class="save-button">저장</button>
          <button @click="cancelEdit" class="cancel-button">취소</button>
        </div>

        <!-- ✅ 기본 댓글 표시 -->
        <div v-else>
          <p class="comment-content">{{ comment.content }}</p>

          <!-- ✅ 수정 및 삭제 버튼 (닉네임 비교) -->
          <div v-if="comment.nickname === currentUser.nickname">
            <button @click="startEdit(comment.id, comment.content)" class="edit-button">수정</button>
            <button @click="deleteComment(comment.id)" class="delete-button">삭제</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ 댓글이 없을 때 메시지 표시 -->
    <div v-else>
      <p>아직 댓글이 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useCommentStore } from "./commentStore";
import { useLoginStore } from "../login/login";

const props = defineProps(["articleId"]);
const commentStore = useCommentStore();
const loginStore = useLoginStore();

const newComment = ref("");
const comments = computed(() => commentStore.comments ?? []); // ✅ undefined 방지

const editingCommentId = ref(null);
const editedContent = ref("");

// ✅ 로그인한 사용자 정보 가져오기
onMounted(() => {
loginStore.fetchUserInfo(); 
commentStore.fetchComments(props.articleId);
});

// ✅ 로그인한 사용자 정보 (닉네임 기반)
const currentUser = computed(() => ({
nickname: loginStore.state.nickname
}));

// ✅ 로그인 여부 확인
const isLoggedIn = computed(() => !!loginStore.state.token);

// ✅ 댓글 수정 모드 시작
const startEdit = (commentId, content) => {
editingCommentId.value = commentId;
editedContent.value = content;
};
//  댓글 작성
const submitComment = async () => {
if (!newComment.value.trim()) return;
try {
  console.log(" 댓글 작성 요청 시작...");
  await commentStore.createComment(props.articleId, newComment.value);
  newComment.value = ""; //  작성 후 입력창 초기화
  console.log(" 댓글 작성 완료");
} catch (error) {
  console.error(" 댓글 작성 실패:", error);
  alert("댓글 작성에 실패했습니다.");
}
};

// ✅ 댓글 수정 취소
const cancelEdit = () => {
editingCommentId.value = null;
editedContent.value = "";
};

// ✅ 댓글 수정 저장
const saveEdit = async (commentId) => {
try {
  await commentStore.updateComment(props.articleId, commentId, editedContent.value);
  editingCommentId.value = null; // 수정 완료 후 다시 원래 UI로 변경
} catch (error) {
  console.error("❌ 댓글 수정 실패:", error);
  alert("댓글 수정에 실패했습니다.");
}
};

// ✅ 댓글 삭제
const deleteComment = async (commentId) => {
if (confirm("정말 삭제하시겠습니까?")) {
  try {
    await commentStore.deleteComment(props.articleId, commentId);
  } catch (error) {
    console.error("❌ 댓글 삭제 실패:", error);
    alert("댓글 삭제에 실패했습니다.");
  }
}
};

// ✅ 날짜 포맷 함수 (이전 오류 수정)
const formatTimeAgo = (dateStr) => {
if (!dateStr) return "날짜 없음"; // 에러 방지
const now = new Date();
const commentDate = new Date(dateStr);
const diffMs = now - commentDate;
const diffMin = Math.floor(diffMs / 1000 / 60);
const diffHours = Math.floor(diffMin / 60);
const diffDays = Math.floor(diffHours / 24);

if (diffMin < 1) return "방금 전";
if (diffMin < 60) return `${diffMin}분 전`;
if (diffHours < 24) return `${diffHours}시간 전`;
return `${diffDays}일 전`;
};
</script>

<style scoped>
@import "./comment.css";
</style>
