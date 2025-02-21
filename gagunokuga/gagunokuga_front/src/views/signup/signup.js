import { defineStore } from "pinia";
import { reactive, computed, watch } from "vue";
import { useRouter } from 'vue-router';
import axios from "axios";  // axios는 API 호출을 위해 추가됨

export const useSignupStore = defineStore("signupStore", () => {
  // 회원가입 관련 상태
  const baseURL = import.meta.env.VITE_API_URL;
  const router = useRouter();

  const state = reactive({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
    nicknameMessage: "",
    emailMessage: "",
    emailPattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,  // state 내부에 포함
    isCheckingNickname: false,
    showVerificationInput: false,
    isEmailVerified: false,
    isNicknameValid: false,
    isPasswordValid: false,
    isConfirmPasswordValid: false,
    isEmailValid: false,
    isSubmitting: false,
  });


  // 닉네임 중복 확인
  const checkNickname = async () => {
    if (!state.nickname) {
      state.nicknameMessage = "닉네임을 입력해주세요.";
      state.isNicknameValid = false;
      return;
    }
  
    // state.isCheckingNickname = true;  // 중복 확인 중 상태 활성화
    try {
      const response = await axios.get(`${baseURL}/api/users/nickname`, {
        params: { nickname: state.nickname },
      });
      
      // 디버깅을 위한 콘솔 출력

      if (!response.data.existing) {
        state.nicknameMessage = "사용 가능한 닉네임입니다.";
        state.isNicknameValid = true;
      } else {
        state.nicknameMessage = "이미 사용 중인 닉네임입니다.";
        state.isNicknameValid = false;
      }
    } catch (error) {
      state.nicknameMessage = "서버 오류, 다시 시도해주세요.";
      state.isNicknameValid = false;
    }
  };
  
  // 이메일 중복 확인
  const checkEmail = async () => {

    if (!state.email) {
      state.emailMessage = "이메일을 입력해주세요.";
      state.isEmailValid = false;
      return;
    }
    if (!state.emailPattern.test(state.email)) {
      state.emailMessage = "올바른 이메일 형식을 입력해주세요.";
      state.isEmailValid = false;
      return;
    }

    try {
      const response = await axios.get(`${baseURL}/api/users/email`, {
        params: { email: state.email },
      });


    if (!response.data.existing) {
      state.emailMessage = "사용 가능한 이메일입니다.";
      state.isEmailValid = true;
    } else {
      state.emailMessage = "이미 사용 중인 이메일입니다.";
      state.isEmailValid = false;
    }
  } catch (error) {
    console.error("이메일 중복 확인 오류:", error);
    state.emailMessage = "서버 오류, 다시 시도해주세요.";
    state.isEmailValid = false;
  } finally {
    state.isCheckingEmail = false;
  }
  };

  // 이메일 인증번호 발송
  const sendVerificationCode = async () => {
    if (!state.isEmailValid) {
      state.emailMessage = "이메일을 인증해주세요.";
      return;
    }
    // 여기 잠깐 EC2 확인용으로 수정함 url이랑 log부분
    try {
      const response = await axios.post(`${baseURL}/api/users/email`, {
        email: state.email,
      });
      if (response.status === 200) {
        state.showVerificationInput = true; // 인증 번호 입력창을 표시
      }
    } catch (error) {
      state.emailMessage = "인증 코드 발송에 실패했습니다. 다시 시도해주세요.";
    }
  };
  

  // 이메일 인증 확인
  const verifyEmail = async () => {
    try {
      const response = await axios.post(`${baseURL}/api/users/email/verify`, {
        email: state.email,
        authcode: state.verificationCode,
      });
      if (response.status === 200 && response.data === "Email verified") {
        state.isEmailVerified = true;
        state.emailMessage = "이메일 인증 성공!";
        // 버튼비활성화
      } else {
        state.emailMessage = "인증 코드가 잘못되었습니다.";
        state.isEmailVerified = false;
      }
    } catch (error) {
      state.emailMessage = "인증 처리에 실패했습니다.";
      state.isEmailVerified = false;
    }
  };

    // DiceBear 아바타 URL 생성 함수
    const generateAvatarUrl = (nickname) => {
      return `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(nickname)}`;
    };

  // 회원가입 처리
  const signup = async () => {

    if (!state.isEmailVerified) {
      alert("이메일 인증이 필요합니다.");
      return;
    }
  
    state.isSubmitting = true;
    try {
      const profileImageUrl = generateAvatarUrl(state.nickname);

      const response = await axios.post(`${baseURL}/api/users`, {
        email: state.email,
        nickname: state.nickname,
        password: state.password,
        profileImageUrl: profileImageUrl
      });
      if (response.status === 201) {
        alert("회원가입 성공");
        router.push("/login");
      }
    } catch (error) {
      alert("회원가입에 실패했습니다.");
    } finally {
      state.isSubmitting = false;
    }
  };

  // 비밀번호와 확인 비밀번호 일치 여부 체크
  const checkPassword = computed(() => state.password === state.confirmPassword);

  // 비밀번호 유효성 체크
  watch(
    () => state.password,
    (newPassword) => {
      state.isPasswordValid = newPassword.length >= 8; // 최소 8자 이상
    }
  );

  // 이메일 유효성 체크
  watch(
    () => state.email,
    (newEmail) => {
      state.isEmailValid = emailPattern.test(newEmail);
    }
  );

  return {
    state,
    checkNickname,
    checkEmail,
    sendVerificationCode,
    verifyEmail,
    signup,
    checkPassword,
  };
});
