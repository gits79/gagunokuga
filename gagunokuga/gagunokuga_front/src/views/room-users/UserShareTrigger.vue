<template>

    <!-- 사용자 공유 버튼 -->
  <div class="chat-toggle" @click="showModal = !showModal">
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      class="chat-icon"
    >
      <!-- 사람 아이콘 -->
      <path 
        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" 
        fill="currentColor"
      />
      <path 
        d="M12 13C8.13401 13 5 15.134 5 18V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V18C19 15.134 15.866 13 12 13Z" 
        fill="currentColor"
      />
      <!-- 플러스 기호 -->
      <circle cx="19" cy="5" r="3" fill="#E53E3E"/>
      <path 
        d="M19 3.5V6.5M17.5 5H20.5" 
        stroke="white" 
        stroke-width="1.5" 
        stroke-linecap="round"
      />
    </svg>
  </div>

  <UserShareModal :isOpen="showModal" title="사용자 초대" @close="showModal = false" />
  </template>
  
  <script setup>
  import { ref } from "vue";
  import UserShareModal from "./UserShareModal.vue";
  
  const showModal = ref(false);
  </script>
  
<style scoped>
.chat-toggle {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: #2D3748;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(45, 55, 72, 0.2);
  transition: all 0.3s ease;
}

.chat-toggle:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(45, 55, 72, 0.3);
}

.chat-icon {
  width: 24px;
  height: 24px;
  color: white;
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #E53E3E;
  color: white;
  border-radius: 12px;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
  