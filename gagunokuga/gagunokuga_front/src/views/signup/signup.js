import { defineStore } from "pinia";
import { reactive, computed, watch } from "vue";
import axios from "axios";  // axios는 API 호출을 위해 추가됨

export const useSignupStore = defineStore("signupStore", () => {
  // 회원가입 관련 상태
  const baseURL = import.meta.env.VITE_API_URL

  const state = reactive({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
    nicknameMessage: "",
    emailMessage: "",
    isCheckingNickname: false,
    showVerificationInput: false,
    isEmailVerified: false,
    isNicknameValid: false,
    isPasswordValid: false,
    isConfirmPasswordValid: false,
    isEmailValid: false,
    isSubmitting: false,
  });

  // 이메일 형식 확인
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // 닉네임 중복 확인
  const checkNickname = async () => {
    try {
      const response = await axios.get('/api/users/nickname', {
        params: { nickname: state.nickname },
      });
      
      // 디버깅을 위한 콘솔 출력
      console.log("응답 데이터:", response.data);  // 서버에서 받은 데이터 확인
      console.log("닉네임 사용 가능 여부:", response.data.isAvailable);  // isAvailable 값 확인
      
      if (!response.data.isExisting) {
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
    if (!state.emailPattern.test(state.email)) {
      state.emailMessage = "올바른 이메일 형식을 입력해주세요.";
      state.isEmailValid = false;
      return;
    }
    try {
      const response = await axios.get('/api/users/email', {
        params: { email: state.email },
      });
      if (response.data.isAvailable) {
        state.emailMessage = "사용 가능한 이메일입니다.";
        state.isEmailValid = true;
      } else {
        state.emailMessage = "이미 사용 중인 이메일입니다.";
        state.isEmailValid = false;
      }
    } catch (error) {
      state.emailMessage = "서버 오류, 다시 시도해주세요.";
      state.isEmailValid = false;
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
        console.log(" EC2에서 확인용(나중에 삭제제) :발송 성공")
        state.showVerificationInput = true; // 인증 번호 입력창을 표시
      }
    } catch (error) {
      console.log(baseURL)
      state.emailMessage = "인증 코드 발송에 실패했습니다. 다시 시도해주세요.";
    }
  };
  

  // 이메일 인증 확인
  const verifyEmail = async () => {
    try {
      const response = await axios.post('/api/users/email/verify', {
        email: state.email,
        authcode: state.verificationCode,
      });
      if (response.status === 200 && response.data === "Email verified") {
        state.isEmailVerified = true;
        state.emailMessage = "이메일 인증 성공!";
      } else {
        state.emailMessage = "인증 코드가 잘못되었습니다.";
        state.isEmailVerified = false;
      }
    } catch (error) {
      state.emailMessage = "인증 처리에 실패했습니다.";
      state.isEmailVerified = false;
    }
  };

  // 회원가입 처리
  const signup = async () => {
    state.isSubmitting = true;
    try {
      const response = await axios.post('/api/users', {
        email: state.email,
        nickname: state.nickname,
        password: state.password,
      });
      if (response.status === 201) {
        alert("회원가입 성공");
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
    sendVerificationCode,
    verifyEmail,
    signup,
    checkPassword,
  };
});
