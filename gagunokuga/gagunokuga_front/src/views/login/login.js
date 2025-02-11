import { defineStore } from "pinia";
import { reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

export const useLoginStore = defineStore("loginStore", () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const router = useRouter();

  const state = reactive({
    email: "",
    password: "",
    token: "",
    error: "",
    showModal: false,  // 모달 상태 추가
  });

  const login = async () => {
    console.log("로그인 시도:", state.email);
    const fullUrl = `${baseURL}/api/users/login`;

    try {
      const response = await axios.post(fullUrl, {
        email: state.email,
        password: state.password,
      });

      if (response.data && response.data.accessToken) {
        state.token = response.data.accessToken;
        localStorage.setItem("accessToken", state.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
        router.push("/");
      } else {
        alert("로그인 실패: 서버에서 토큰이 반환되지 않았습니다.");
      }
    } catch (error) {
      console.error("로그인 요청 오류:", error);
      state.error = "서버 오류가 발생했습니다.";
      return { success: false, message: state.error };
    }
  };

  const kakaoLogin = () => {
    window.location.href = `${baseURL}/api/oauth/login/kakao`;
  };

  const passwordReset = async (resetEmail) => {
    try {
      const response = await axios.post('/api/users/reset-password', { email: resetEmail });
      console.log('비밀번호 재설정 이메일 전송 성공', response.data);
    } catch (error) {
      console.error('비밀번호 재설정 이메일 전송 실패', error);
    }
  };

  return {
    login,
    state,
    kakaoLogin,
    passwordReset,
  };
});
