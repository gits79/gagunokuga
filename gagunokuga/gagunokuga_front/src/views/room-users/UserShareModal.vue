<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>사용자 초대</h2>
        <button @click="closeModal">×</button>
      </div>

      <div class="modal-body">
        <!-- 현재 사용자 및 초대 가능 인원 -->
        <div class="user-status">
          <p>현재 사용자: {{ currentUserCount }}명 / 최대 {{ maxUsers }}명</p>
          <p>남은 초대 가능 인원: {{ remainingInvites }}명</p>
        </div>

        <!-- 닉네임 검색 입력 -->
        <div class="search-container">
          <input v-model="searchQuery" @input="searchUsers" placeholder="닉네임 검색" class="search-input"
            :disabled="!isHost" />

          <ul v-if="isHost && searchQuery.trim() && searchResults.length > 0" class="search-results">
            <li v-for="user in searchResults" :key="user.nickname" @click="selectUser(user)" class="search-item">
              <img :src="user.profileImageUrl || defaultProfileImage" class="profile-img" alt="프로필 이미지" />
              <span>{{ user.nickname }}</span>
            </li>
          </ul>
        </div>

        <!-- 선택된 유저 목록 (닉네임 검색 아래, 초대 버튼 위로 이동) -->
        <div v-if="selectedUsers.length > 0" class="selected-users">
          <h3>선택된 사용자</h3>
          <ul>
            <li v-for="user in selectedUsers" :key="user.nickname" class="selected-user">
              <span>{{ user.nickname }}</span>
              <button @click="removeSelectedUser(user)" class="remove-btn">×</button>
            </li>
          </ul>
        </div>

        <!-- 초대 에러 메시지 -->
        <p v-if="inviteError" class="error-message">{{ inviteError }}</p>

        <!-- 초대 버튼 -->
        <div class="modal-footer">
          <button @click="validateAndInvite" class="invite-btn" :disabled="!isHost || selectedUsers.length === 0">
            초대
          </button>
        </div>

        <!-- 프로젝트 내 사용자 목록 -->
        <div class="user-list-container">
          <h3>프로젝트 내 사용자</h3>
          <div class="user-list-scroll">
            <ul v-if="users.length > 0">
              <li v-for="user in users" :key="user.nickname" class="user-item">
                <img :src="user.profileImageUrl || defaultProfileImage" alt="프로필 이미지" class="profile-img" />
                <div class="user-info">
                  <span class="nickname">
                    {{ user.nickname }}
                    <span v-if="user.isHost">(방장)</span>
                  </span>
                </div>
                <button v-if="isHost && !user.isHost" @click="kickUser(user.nickname)" class="kick-btn">
                  내보내기
                </button>
              </li>
            </ul>
            <p v-else>초대된 사용자가 없습니다.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import useUserShare from "./userShareModal.js";
import "@/views/room-users/userShareModal.css";

const props = defineProps(["isOpen"]);
const emit = defineEmits(["close"]);

const {
  users,
  defaultProfileImage,
  isHost,
  kickUser,
  fetchUsers,
  searchQuery,
  searchResults,
  searchUsers,
  selectedUsers,
  selectUser: originalSelectUser, // 기존 selectUser 함수 사용 (중복 선언 방지)
  removeSelectedUser,
  inviteUsers,
} = useUserShare();

const closeModal = () => emit("close");

// 최대 초대 가능 인원 설정 (8명)
const maxUsers = 10;

// 현재 사용자 수 계산
const currentUserCount = computed(() => users.value.length);

// 남은 초대 가능 인원 계산
const remainingInvites = computed(() => maxUsers - currentUserCount.value);

// 초대 가능 인원을 초과할 경우 경고 메시지
const inviteError = ref("");

// 초대 버튼 클릭 시 유효성 검사 후 초대 실행
const validateAndInvite = () => {
  if (remainingInvites.value <= 0) {
    inviteError.value = "현재 초대 가능한 인원이 없습니다.";
    return;
  }

  if (selectedUsers.value.length > remainingInvites.value) {
    inviteError.value = `현재 초대 가능한 인원은 ${remainingInvites.value}명입니다.`;
    return;
  }

  inviteError.value = "";
  inviteUsers();
  searchQuery.value = ""; // 초대 후 검색창 초기화
};

// 기존 selectUser 함수를 래핑 (중복 선언 방지)
const selectUser = (user) => {
  // 이미 프로젝트 내에 있는 사용자라면 에러 메시지 표시
  if (users.value.some((u) => u.nickname === user.nickname)) {
    inviteError.value = "이미 초대된 사용자입니다.";
    return;
  }

  // 초대 가능한 인원을 초과하는 경우 메시지 표시
  if (selectedUsers.value.length >= remainingInvites.value) {
    inviteError.value = `현재 초대 가능한 인원은 ${remainingInvites.value}명입니다.`;
    return;
  }

  // 기존 selectUser 호출
  originalSelectUser(user);
  inviteError.value = ""; // 정상 선택 시 에러 메시지 초기화
};

fetchUsers();
</script>

<style scoped>
/* 현재 사용자 및 초대 가능 인원 스타일 */
.user-status {
  background: #f8f8f8;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}

/* 초대 가능 인원 초과 시 경고 메시지 */
.error-message {
  color: #d32f2f;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
}

/* 프로젝트 내 사용자 목록에 스크롤뷰 적용 */
.user-list-scroll {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 8px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e5e5e5;
}
</style>
