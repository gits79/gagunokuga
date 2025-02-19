<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>사용자 초대</h2>
        <button @click="closeModal">×</button>
      </div>

      <div class="modal-body">
        <p>방장만 사용자를 초대하거나 강퇴할 수 있습니다.</p>

        <!--  전체 사용자 검색 후 초대 -->
        <div class="search-container">
          <input
            v-model="searchQuery"
            @input="searchUsers"
            placeholder="닉네임 검색"
            class="search-input"
            :disabled="!isHost"
          />

          <!-- 검색어가 있고 결과가 있으며, 방장일 때만 표시-->
          <ul
            v-if="isHost && searchQuery.trim() && searchResults.length > 0"
            class="search-results"
          >
            <li
              v-for="user in searchResults"
              :key="user.nickname"
              @click="selectUser(user)"
              class="search-item"
            >
              <img
                :src="user.profileImageUrl || defaultProfileImage"
                class="profile-img"
                alt="프로필 이미지"
              />
              <span>{{ user.nickname }}</span>
            </li>
          </ul>
        </div>

        <!--  선택된 유저 목록 -->
        <div v-if="selectedUsers.length > 0" class="selected-users">
          <h3>선택된 사용자</h3>
          <ul>
            <li v-for="user in selectedUsers" :key="user.nickname" class="selected-user">
              <span>{{ user.nickname }}</span>
              <button @click="removeSelectedUser(user)" class="remove-btn">×</button>
            </li>
          </ul>
        </div>

        <!--  현재 프로젝트 사용자 목록 -->
        <div class="user-list-container">
          <h3>프로젝트 내 사용자</h3>
          <ul v-if="users.length > 0">
            <li v-for="user in users" :key="user.nickname" class="user-item">
              <img
                :src="user.profileImageUrl || defaultProfileImage"
                alt="프로필 이미지"
                class="profile-img"
              />
              <div class="user-info">
                <span class="nickname">
                  {{ user.nickname }}
                  <span v-if="user.isHost">(방장)</span>
                </span>
              </div>

              <!-- 버튼 텍스트 "내보내기" -->
              <!-- 방장이면서, 해당 유저가 방장이 아닐 때만 표시 -->
              <button
                v-if="isHost && !user.isHost"
                @click="kickUser(user.nickname)"
                class="kick-btn"
              >
                내보내기
              </button>
            </li>
          </ul>
          <p v-else>초대된 사용자가 없습니다.</p>
        </div>
      </div>

      <div class="modal-footer">
        
        <button
          @click="inviteUsers"
          class="invite-btn"
          :disabled="!isHost || selectedUsers.length === 0"
        >
          초대
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
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
  selectUser,
  removeSelectedUser,
  inviteUsers,
} = useUserShare();


const closeModal = () => emit("close");

// 모달이 열릴 때마다 사용자 목록 불러오기
fetchUsers();
</script>
