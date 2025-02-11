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
    showModal: false, // 모달 상태 추가
  });

  const login = async () => {
    console.log("로그인 시도:", state.email);
    const fullUrl = `${baseURL}/api/users/login`;

    try {
      console.log("요청 데이터:", {
        email: state.email,
        password: state.password,
      });

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
        state.token = response.data.accessToken;
        localStorage.setItem("accessToken", state.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
        router.push("/");
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
      state.error = "서버 오류가 발생했습니다.";
      return { success: false, message: state.error };
    }
  };

  const kakaoLogin = () => {
    window.location.href = `${baseURL}/api/oauth/login/kakao`;
  };

  const handleLoginSuccess = async (tokenData) => {
    console.log('Handling login success with tokens:', tokenData);

    if (tokenData?.accessToken && tokenData?.refreshToken) {
      try {
        state.token = tokenData.accessToken;
        localStorage.setItem("accessToken", tokenData.accessToken);
        localStorage.setItem("refreshToken", tokenData.refreshToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${tokenData.accessToken}`;

        console.log('Tokens stored successfully:', {
          access: localStorage.getItem('accessToken'),
          refresh: localStorage.getItem('refreshToken')
        });
        return true;
      } catch (error) {
        console.error('Error storing tokens:', error);
        return false;
      }
    } else {
      console.error('Invalid token data received:', tokenData);
      return false;
    }
  };

  const passwordReset = async (resetEmail) => {
    try {
      const response = await axios.post(`${baseURL}/api/users/reset-password`, { email: resetEmail });
      console.log('비밀번호 재설정 이메일 전송 성공', response.data);
      alert("비밀번호 재설정 이메일이 전송되었습니다.");
    } catch (error) {
      console.error('비밀번호 재설정 이메일 전송 실패', error);
      alert("비밀번호 재설정 요청 중 오류가 발생했습니다.");
    }
  };

  return {
    login,
    state,
    kakaoLogin,
    handleLoginSuccess,
    passwordReset,
  };
});
