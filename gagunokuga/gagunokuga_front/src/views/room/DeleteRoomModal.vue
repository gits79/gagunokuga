<template>
    <div class="modal-overlay">
      <div class="modal">
        <img src="@/assets/warning.png" alt="경고" class="warning-icon" />
        <h2>정말 삭제하시겠습니까?</h2>
        <p></p>
        <div class="button-group">
          <button class="cancel-button" @click="closeModal">취소</button>
          <button class="delete-button" @click="confirmDelete">삭제</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      closeModal() {
        this.$emit("close");
      },
      confirmDelete() {
        this.$emit("delete");
      },
    },
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal {
    background: white;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    width: 350px;
  }
  
  .warning-icon {
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
  }
  
  h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
  }
  
  .button-group {
    display: flex;
    width: 100%;
    gap: 10px; 
  }
  
  .cancel-button,
  .delete-button {
    flex: 1; 
    padding: 12px 0;
    border: none;
    cursor: pointer;
    font-size: 16px;
    border-radius: 20px; 
    font-weight: bold;
  }
  
  .cancel-button {
    background: #e0e0e0;
    color: black;
  }
  
  .delete-button {
    background: #333;
    color: white;
  }
  </style>
  