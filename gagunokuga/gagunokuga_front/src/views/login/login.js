import { defineStore } from "pinia";
import { reactive, computed, watch } from "vue";
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
    // console.log("로그인 정보:", { email: state.email, password: state.password });
    const response = await axios.post(`${baseURL}/api/users/login`, {
      email: state.email,
      password: state.password,
    });

    // 서버에서 accessToken과 refreshToken을 반환
    if (response.data.accessToken) {
      console.log("로그인 성공: 토큰을 저장합니다.", response.data.accessToken);
      state.token = response.data.accessToken;
      state.refreshToken = response.data.refreshToken || '';  // refreshToken도 저장할 수 있다면 저장

      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem("accessToken", state.token);
      if (state.refreshToken) {
        localStorage.setItem("refreshToken", state.refreshToken);
      }

      state.error = "";  // 에러 메시지 초기화
      router.push("/");  // 로그인 성공 시 홈 화면으로 이동
      return { success: true };  // 로그인 성공 반환
    } else {
      state.error = "로그인에 실패했습니다.";  // 로그인 실패 시 에러 메시지 설정
      console.log("로그인 실패: 토큰이 없습니다.");
      return { success: false, message: state.error };  // 로그인 실패 반환
    }
  } catch (error) {
    console.error("로그인 요청 오류:", error);  // 에러 메시지 출력
    state.error = "서버 오류가 발생했습니다.";  // 서버 에러 처리
    return { success: false, message: state.error };  // 서버 오류 반환
  }
};

  return {
    login,
    state
  };
});
