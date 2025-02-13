<template>
    <div class="container">
      <!-- 제목 입력 -->
      <div class="input-box">
        <input
          type="text"
          v-model="title"
          maxlength="100"
          placeholder="제목을 입력해주세요."
        />
        <p class="char-count">{{ title.length }} / 100</p>
        <p v-if="showTitleError" class="error-text">필수 입력 항목입니다.</p>
      </div>
  
      <!-- 이미지 업로드 -->
      <div
        class="upload-box"
        @click="triggerFileInput"
        @dragover.prevent
        @drop="handleDrop"
      >
        <input
          type="file"
          class="hidden"
          ref="fileInput"
          @change="handleFileUpload"
          multiple
          accept="image/*"
        />
        <p v-if="images.length === 0">
          <strong>드래그 앤 드롭이나 추가하기 버튼으로
          <br />사진을 업로드해주세요.</strong><br /><br />
          <span class="small-text" style="color: red;">필수 입력 항목입니다.</span><br />
          <span class="small-text">*최대 5장 업로드 가능*</span><br /><br />
        </p>
        <div class="image-preview" v-if="images.length > 0">
          <div class="preview-item" v-for="(image, index) in images" :key="index">
            <img :src="image.url" alt="업로드된 이미지" @click.stop="removeImage(index)" />
            <button class="remove-btn" @click.stop="removeImage(index)">×</button>
          </div>
        </div>
        <button class="upload-btn">사진 추가하기</button>
      </div>
  
      <!-- 본문 입력 -->
      <div class="input-box">
        <textarea
          v-model="content"
          maxlength="300"
          placeholder="내용을 입력해주세요."
        ></textarea>
        <p class="char-count">{{ content.length }} / 300</p>
      </div>
  
      <!-- 버튼 -->
      <div class="button-group">
        <button class="publish-btn" @click="uploadArticle" :disabled="!isFormValid">작성완료</button>
      </div>
    </div>
</template>
  
<script setup>
  import { ref, watch, computed } from "vue";
  import { useArticleStore } from "./articleStore";
  import { useRouter } from "vue-router";

  const store = useArticleStore();
  const router = useRouter();

  const title = ref("");
  const content = ref("");
  const fileInput = ref(null);
  const images = ref([]); // 이미지 리스트
  const showTitleError = ref(false);
  
  const triggerFileInput = () => {
    fileInput.value.click();
  };
  
  // 제목 값이 변경될 때 에러 메시지 관리
  watch(title, (newValue) => {
    showTitleError.value = newValue.trim() === "";
  });

  // **작성완료 버튼 활성화 조건**
  const isFormValid = computed(() => {
    return title.value.trim().length > 0 && images.value.length > 0;
  });

  
  // 파일 업로드 처리 (최대 5장)
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
  
    if (images.value.length + files.length > 5) {
      alert("최대 5장까지 업로드할 수 있습니다.");
      return;
    }
  
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        images.value.push({ file, url: e.target.result });
      };
      reader.readAsDataURL(file);
    });
  };
  
  // 드래그 앤 드롭 파일 업로드 처리
  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
  
    if (images.value.length + files.length > 5) {
      alert("최대 5장까지 업로드할 수 있습니다.");
      return;
    }
  
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        images.value.push({ file, url: e.target.result });
      };
      reader.readAsDataURL(file);
    });
  };
  
  // 이미지 삭제 기능
  const removeImage = (index) => {
    images.value.splice(index, 1);
  };

  // 작성완료 버튼 클릭 시 게시글 작성
  const uploadArticle = () => {
      const formData = new FormData();

      if(content.value.trim() === "") {
          content.value = "";
      }

      // JSON 데이터 객체 생성
      const articleData = {
          title: title.value,
          content: content.value,
          nickname: "user1", // 일단 임의 유저 설정 ----> 수정 필요!!!
      };
  
      // JSON 데이터를 Blob으로 변환하여 추가
      formData.append("articleData", new Blob([JSON.stringify(articleData)], { type: "application/json" }));
      
      // 이미지 파일 추가
      images.value.forEach((image) => {
          formData.append("images", image.file);
      });

        // 게시글 작성 API 호출
        store.createArticle(formData);
    };
    
</script>
  
<style scoped>
  @import "./articleCreate.css";

</style>
  