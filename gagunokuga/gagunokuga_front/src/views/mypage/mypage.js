import { defineStore } from "pinia";
import { reactive } from "vue";
import axios from "axios";

// 기본 API URL
const baseURL = import.meta.env.VITE_API_URL;

export const useMypageStore = defineStore("userStore", () => {
    // 상태 정의
    const state = reactive({
        user: null, // 사용자 정보
        isLoading: false, // 로딩 상태
        error: null, // 에러 상태
    });

    // 사용자 정보 가져오기
    const getUserInfo = async () => {
        state.isLoading = true;
        try {
            const response = await axios.get(`${baseURL}/api/users`);
            state.user = response.data;
            return response.data; // ✅ 추가 (변경된 사용자 정보 반환)
        } catch (error) {
            state.error = "사용자 정보 로딩 실패";
            console.error(error);
        } finally {
            state.isLoading = false;
        }
    };


    // 닉네임 중복 확인
    const checkNicknameAvailability = async (nickname) => {
        try {
            const response = await axios.get(`${baseURL}/api/users/nickname`, {
                params: { nickname },
            });
            return !response.data.existing;
        } catch (error) {
            throw new Error("닉네임 중복 확인 실패");
        }
    };

    // 사용자 정보 수정
    const updateUserInfo = async (updatedData) => {
        state.isLoading = true;
        try {
            await axios.put(`${baseURL}/api/users`, updatedData);

            // ✅ 업데이트 후 최신 데이터 가져오기
            await getUserInfo();
        } catch (error) {
            state.error = "사용자 정보 수정 실패";
            console.error(error);
        } finally {
            state.isLoading = false;
        }
    };

    return {
        state,
        getUserInfo,
        checkNicknameAvailability,
        updateUserInfo,
    };
});
