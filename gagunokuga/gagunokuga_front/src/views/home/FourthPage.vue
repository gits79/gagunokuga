<!-- RealtimeCollaborationSection.vue -->
<template>
  <section class="collaboration-section">
    <div class="section-container">
      <div class="content-wrapper">
        <!-- Demo Interface - Left Side -->
        <div class="demo-container">
          <div class="demo-interface">
            <!-- Active Users Indicator -->
            <div class="users-indicator">
              <div class="status-dot"></div>
              <span class="status-text">3명이 접속 중...</span>
            </div>

            <!-- Furniture Layout Preview -->
            <div class="layout-preview">
              <div class="sync-badge">실시간 동기화 중</div>
              <!-- Mock Furniture Layout -->
              <div class="furniture furniture-1"></div>
              <div class="furniture furniture-2"></div>
              <!-- Active User Cursors -->
              <div class="user-cursor">
                <div class="cursor-dot"></div>
                <span class="cursor-label">혜진</span>
              </div>
            </div>

            <!-- Chat Interface -->
            <div class="chat-container">
              <div class="chat-messages">
                <div class="message received">
                  <div class="avatar">M</div>
                  <div class="message-bubble">
                    침대를 조금 더 왼쪽으로 옮기는 건 어떨까요?
                  </div>
                </div>
                <div class="message sent">
                  <div class="message-bubble">
                    좋은 생각이에요! 그럼 책상도 같이 옮겨볼까요?
                  </div>
                  <div class="avatar">Y</div>
                </div>
              </div>
              <!-- Chat Input -->
              <div class="chat-input">
                <input 
                  type="text" 
                  placeholder="메시지를 입력하세요"
                  v-model="newMessage"
                  @keyup.enter="sendMessage"
                >
                <button @click="sendMessage">전송</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Content - Right Side -->
        <div class="content-container">
          <h2 class="main-title">
            떨어져 있어도 함께 만드는<br/>
            우리 집의 이야기
          </h2>
          
          <p class="main-description">
            실시간 동시 편집으로 함께 가구를 배치하고<br/>
            채팅으로 즉각적인 피드백을 주고받으세요
          </p>
          
          <p class="sub-description">
            떨어져 있어도 한 공간에서 계획하는 것처럼 편리합니다
          </p>

          <!-- Feature Cards -->
          <div class="feature-cards">
            <div class="feature-card">
              <div class="feature-header">
                <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <h3>실시간 동시 편집</h3>
              </div>
              <p>여러 명이 동시에 접속하여 가구 배치와 수정이 가능합니다</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-header">
                <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <h3>실시간 채팅</h3>
              </div>
              <p>채팅으로 즉각적인 의견 교환이 가능합니다</p>
            </div>
          </div>

          <!-- CTA Button -->
          <button class="cta-button">
            협업 시작하기
            <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useRouter } from 'vue-router'  // 추가
export default {
  name: 'RealtimeCollaborationSection',
  data() {
    return {
      newMessage: '',
      messages: [
        {
          id: 1,
          user: 'M',
          text: '침대를 조금 더 왼쪽으로 옮기는 건 어떨까요?',
          type: 'received'
        },
        {
          id: 2,
          user: 'Y',
          text: '좋은 생각이에요! 그럼 책상도 같이 옮겨볼까요?',
          type: 'sent'
        }
      ]
    }
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim()) {
        // Add message handling logic here
        this.newMessage = '';
      }
    }
  }
}
</script>

<style scoped>
.collaboration-section {
  width: 100%;
  background-color: #ffffff;
  padding: 4rem 0;
}

.section-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.content-wrapper {
  display: flex;
  gap: 4rem;
  align-items: flex-start;
}

/* Demo Interface Styles */
.demo-container {
  flex: 1;
  animation: slideIn 0.6s ease-out;
}

.demo-interface {
  background-color: #f8fafc;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Users Indicator */
.users-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.status-dot {
  width: 0.75rem;
  height: 0.75rem;
  background-color: #22c55e;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-text {
  font-size: 0.875rem;
  color: #64748b;
}

/* Layout Preview */
.layout-preview {
  background-color: white;
  border-radius: 0.5rem;
  height: 20rem;
  position: relative;
  border: 1px solid #e2e8f0;
  margin-bottom: 1rem;
}

.sync-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background-color: #dbeafe;
  color: #2563eb;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.furniture {
  position: absolute;
  transition: all 0.3s ease;
}

.furniture-1 {
  top: 25%;
  left: 25%;
  width: 8rem;
  height: 5rem;
  background-color: #dbeafe;
  border-radius: 0.375rem;
}

.furniture-2 {
  bottom: 25%;
  right: 25%;
  width: 6rem;
  height: 6rem;
  background-color: #dcfce7;
  border-radius: 0.375rem;
}

.user-cursor {
  position: absolute;
  top: 33%;
  right: 33%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: float 3s ease-in-out infinite;
}

.cursor-dot {
  width: 1rem;
  height: 1rem;
  background-color: #3b82f6;
  border-radius: 50%;
}

.cursor-label {
  font-size: 0.75rem;
  background-color: #3b82f6;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

/* Chat Interface */
.chat-container {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.message.sent {
  flex-direction: row-reverse;
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
}

.message.received .avatar {
  background-color: #dbeafe;
  color: #2563eb;
}

.message.sent .avatar {
  background-color: #dcfce7;
  color: #16a34a;
}

.message-bubble {
  background-color: #f1f5f9;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  max-width: 80%;
  font-size: 0.875rem;
}

.message.sent .message-bubble {
  background-color: #2563eb;
  color: white;
}

.chat-input {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.chat-input input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.chat-input input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.chat-input button {
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.chat-input button:hover {
  background-color: #1d4ed8;
}

/* Content Styles */
.content-container {
  flex: 1;
  padding-top: 2rem;
}

.main-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.main-description {
  font-size: 1.125rem;
  color: #475569;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.sub-description {
  color: #64748b;
  margin-bottom: 2rem;
}

/* Feature Cards */
.feature-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.feature-card {
  background-color: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.feature-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.feature-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #2563eb;
}

.feature-card h3 {
  font-weight: 600;
  color: #1e293b;
}

.feature-card p {
  color: #475569;
  font-size: 0.875rem;
}

/* CTA Button */
.cta-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2563eb;
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
}

.cta-button:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

.button-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Animations
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
} */

</style>