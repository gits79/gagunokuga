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
        <button class="publish-btn" @click="uploadArticle" :disabled="!isFormValid">{{ isEditMode ? "수정완료" : "작성완료" }}</button>
      </div>
    </div>
</template>
  
<script setup>
  import { ref, watch, computed, onMounted } from "vue";
  import { useArticleStore } from "./articleStore";
  import { useLoginStore } from "../login/login";
  import { useRoute } from "vue-router";

  const store = useArticleStore();
  const loginStore = useLoginStore();
  const route = useRoute();

  // 수정 모드 여부 확인
  const isEditMode = computed(() => !!route.params.articleId);

  const title = ref("");
  const content = ref("");
  const fileInput = ref(null);
  const images = ref([]); // 이미지 리스트
  const showTitleError = ref(false);
  const deleteList = ref([]); // 삭제할 이미지 리스트
  const originalData = ref(null); // ✅ 기존 게시글 데이터 저장
  
  const triggerFileInput = () => {
    fileInput.value.click();
  };
  
  // 제목 값이 변경될 때 에러 메시지 관리
  watch(title, (newValue) => {
    showTitleError.value = newValue.trim() === "";
  });

  // ✅ 기존 데이터와 현재 입력된 데이터를 비교하여 수정 여부 체크
  const isModified = computed(() => {
    if (!originalData.value) return false;

    // 제목, 내용 비교
    const isTitleChanged = title.value.trim() !== originalData.value.title.trim();
    const isContentChanged = content.value.trim() !== originalData.value.content.trim();

    // 이미지 비교
    const isImagesChanged = 
      images.value.length !== originalData.value.images.length ||
      images.value.some((img, index) => img.url !== originalData.value.images[index]?.url) ||
      deleteList.value.length > 0; // 삭제된 이미지가 있는 경우

    return isTitleChanged || isContentChanged || isImagesChanged;
  });

  // **작성완료 버튼 활성화 조건**
  const isFormValid = computed(() => {
    return title.value.trim().length > 0 && images.value.length > 0 && (!isEditMode.value || isModified.value);
  });

  // 수정 모드라면 기존 게시글 데이터 불러오기
  onMounted(async () => {
    if (isEditMode.value) {
      await store.getArticle(route.params.articleId);
      title.value = store.article.title;
      content.value = store.article.content;

      // 기존 이미지 불러오기
      images.value = store.article.articleImages.map(image => ({
        file: null,  // 기존 이미지는 file 객체가 아님
        url: image.imageUrl
      }));

      // ✅ 기존 게시글 데이터 저장
      originalData.value = {
        title: store.article.title,
        content: store.article.content,
        images: [...images.value], // 원본 이미지 저장
      };
    }
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
    const removedImage = images.value[index];

    // 수정 모드 && 기존 이미지일 때 삭제 리스트에 추가
    if (isEditMode.value && removedImage.file === null) {
       // 현재 삭제하려는 이미지의 URL과 동일한 원본 이미지 찾기
      const originalImage = store.article.articleImages.find(img => img.imageUrl === removedImage.url);
      
      if(originalImage){
        deleteList.value.push(originalImage.id);
      }
    }

    images.value.splice(index, 1);
  };

  // 작성완료 버튼 클릭 시 게시글 작성
  const uploadArticle = async () => {
      const formData = new FormData();

      if(content.value.trim() === "") {
          content.value = "";
      }

      // JSON 데이터 객체 생성
      const articleData = {
          title: title.value,
          content: content.value,
          nickname: loginStore.state.nickname,
      };
  
      // JSON 데이터를 Blob으로 변환하여 추가
      formData.append("articleData", new Blob([JSON.stringify(articleData)], { type: "application/json" }));
      
      // 이미지 파일 추가
      images.value.forEach((image) => {
        if(image.file){
          formData.append("images", image.file);
        }
      });
      
      // 수정 모드일 때
      if(isEditMode.value) {
          // 삭제할 이미지 ID 추가
          formData.append("deleteList", new Blob([JSON.stringify(deleteList.value)], { type: "application/json" }));
          // 게시글 수정 API 호출
          await store.updateArticle(route.params.articleId, formData);
      } else {
        // 새 게시글 작성 API 호출
        await store.createArticle(formData);

      }
    };
    
</script>
  
<style scoped>
  @import "./articleCreate.css";

</style>
  