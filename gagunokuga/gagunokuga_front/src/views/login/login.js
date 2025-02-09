import { defineStore } from "pinia";
import { reactive } from "vue";
import axios from "axios";  // axios는 API 호출을 위해 추가됨 
import { useRouter } from "vue-router";

export const useLoginStore = defineStore("loginStore", () => {
  // 로그인 관련 상태
  const baseURL = import.meta.env.VITE_API_URL;
  const router = useRouter();  // 라우터 추가

  const state = reactive({
    email: "",
    password: "",
    token: "",  // 토큰을 저장할 변수 추가
    error: "",  // 에러 메시지 저장할 변수 추가
  });

  const login = async () => {
    console.log("로그인 시도:", state.email);
  const fullUrl = `${baseURL}/api/users/login`;
  console.log("요청 URL:", fullUrl);
  
  try {
    console.log("요청 데이터:", {
      email: state.email,
      password: state.password
    });
    
    // axios 인터셉터 추가
    axios.interceptors.request.use(request => {
      console.log('Starting Request:', {
        url: request.url,
        method: request.method,
        data: request.data,
        headers: request.headers
      });
      return request;
    });

    const response = await axios.post(fullUrl, {
      email: state.email,
      password: state.password,
    }, {
      withCredentials: true
    });
    
    console.log("로그인 응답 데이터:", response.data);
    
    if (response.data && response.data.accessToken) {
      state.token = response.data.accessToken;  // 토큰 저장
      localStorage.setItem("accessToken", state.token);  // 로컬 스토리지에 저장
      axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`; // 기본 헤더 설정
      router.push("/"); // 로그인 후 이동할 페이지 설정
    } else {
      alert("로그인 실패: 서버에서 토큰이 반환되지 않았습니다.");
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

  const kakaoLogin = () => {
    // axios 요청 없이 직접 카카오 로그인 페이지로 이동
    window.location.href = `${baseURL}/api/oauth/login/kakao`;
  };
  // JWT 토큰을 저장하고 홈으로 리다이렉트하는 함수
  const handleLoginSuccess = (token) => {
    state.token = token;
    localStorage.setItem("accessToken", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    router.push("/");
  };
  return {
    login,
    state,
    kakaoLogin,
    handleLoginSuccess
  };
});
