import { defineStore } from "pinia";
import { reactive } from "vue";
import axios from "axios";  // axios는 API 호출을 위해 추가됨 
import { useRouter } from "vue-router";

export const useLoginStore = defineStore("loginStore", () => {
  // 로그인 관련 상태
  const baseURL = import.meta.env.VITE_APP_API_BASE_URL;
  const router = useRouter();  // 라우터 추가

  const state = reactive({
    email: "",
    password: "",
    token: "",  // 토큰을 저장할 변수 추가
    error: "",  // 에러 메시지 저장할 변수 추가
  });

  const login = async () => {
    try {
      const response = await axios.post(`${baseURL}/api/users/login`, {
        email: state.email,
        password: state.password,
      });

      console.log("Login response:", response);
  
      if (response.data.accessToken) {
        state.token = response.data.accessToken;
        state.refreshToken = response.data.refreshToken || '';

        console.log("Access Token received:", response.data.accessToken);
        
        localStorage.setItem("accessToken", state.token);
        if (state.refreshToken) {
          localStorage.setItem("refreshToken", state.refreshToken);
        }
        state.error = "";  // 에러 메시지 초기화
        router.push("/");  // 로그인 성공 시 홈 화면으로 이동
        return { success: true };
      } else {
        state.error = "로그인에 실패했습니다.";
        return { success: false, message: state.error };
      }
    } catch (error) {
      console.error("로그인 요청 오류:", error);
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
  
        if (error.response.status === 404) {
          alert(error.response.data || "가입되지 않은 회원입니다.");
        } else {
          alert("서버 오류가 발생했습니다.");
        }
      } else {
        alert("서버 연결에 실패했습니다.");
      }
      state.error = "서버 오류가 발생했습니다.";  // 서버 오류 처리
      return { success: false, message: state.error };
    }
  };
  
  const kakaoLogin = async () => {
    window.location.href = `${baseURL}/api/oauth/login/kakao`;
  }
  
  return {
    login,
    state,
    kakaoLogin
  };
});
