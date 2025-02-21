import { defineStore } from "pinia";
import { reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import defaultProfileImage from "@/assets/gagunokugaLogo.png";

export const useLoginStore = defineStore("loginStore", () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const router = useRouter();

  const state = reactive({
    email: "",
    password: "",
    token: "",
    nickname: "", // 닉네임 추가
    profileImage: "", // 프로필이미지 추가
    provider: "", // oAuth 여부 확인용
    error: "",
    showModal: false, // 모달 상태 추가
  });


 // DiceBear 아바타 URL 생성 함수
  const generateAvatarUrl = (nickname) => {
    return `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(nickname)}`;
  };


  // 로그인
  const login = async () => {
    const fullUrl = `${baseURL}/api/users/login`;

    try {
      axios.interceptors.request.use(request => {
        return request;
      });

      const response = await axios.post(fullUrl, {
        email: state.email,
        password: state.password,
      });


      if (response.data && response.data.accessToken) {
        state.token = response.data.accessToken;
        localStorage.setItem("accessToken", state.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
        setupAxiosInterceptors(); // interceptor 설정
        await router.push("/");
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

  // 카카오로그인
  const kakaoLogin = () => {
    window.location.href = `${baseURL}/api/oauth/login/kakao`;
  };

  // 카카오로그인 연동 - 토큰 확인
  const handleLoginSuccess = async (tokenData) => {

    if (tokenData?.accessToken && tokenData?.refreshToken) {
      try {
        state.token = tokenData.accessToken;
        localStorage.setItem("accessToken", tokenData.accessToken);
        localStorage.setItem("refreshToken", tokenData.refreshToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${tokenData.accessToken}`;

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

  // 비밀번호 재설정
  const passwordReset = async (resetEmail) => {
    try {
      const response = await axios.post(`${baseURL}/api/users/reset-password`, { email: resetEmail });
      alert("비밀번호 재설정 이메일이 전송되었습니다.");
    } catch (error) {
      alert("비밀번호 재설정 요청 중 오류가 발생했습니다.");
    }
  };

  // 사용자 정보 불러오기
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/users`, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      //console.log(response.data);
      if (response.data) {
        state.nickname = response.data.nickname;
        state.profileImage = response.data.profileImageUrl || generateAvatarUrl(response.data.nickname);
        state.provider = response.data.provider;
        state.email = response.data.email;
      }
    } catch (error) {
      console.error("사용자 정보 불러오기 실패:", error);
      throw error; // 에러를 상위로 전파
    }
  };

  // 로그아웃 메서드
  const logout = () => {
    state.token = "";
    state.nickname = "";
    state.profileImage = "";
    state.provider = "";
    state.password = "";
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete axios.defaults.headers.common["Authorization"];
  };

  const setupAxiosInterceptors = () => {

  // 기존 인터셉터 제거
  axios.interceptors.response.handlers = [];
  
  // 응답 인터셉터 설정
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // 토큰이 만료되었을 때 즉시 로그아웃 처리
        logout();
        router.push('/login');
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );

  // 요청 인터셉터 설정
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // 토큰 만료 확인
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = tokenPayload.exp * 1000;
          
          if (Date.now() >= expirationTime) {
            logout();
            router.push('/login');
            return Promise.reject('Token expired');
          }
        } catch (error) {
          console.error('Error checking token:', error);
        }
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  };

  return {
    login,
    state,
    kakaoLogin,
    handleLoginSuccess,
    passwordReset,
    fetchUserInfo,
    logout,
    setupAxiosInterceptors,
  };
}, {persist: true});
