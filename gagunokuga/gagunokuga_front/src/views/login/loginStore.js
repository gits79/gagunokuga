import axios from 'axios';
import { ref } from 'vue';

// 로그인 상태 관리
export const email = ref('');
export const password = ref('');
export const isLoggedIn = ref(false);
export const userNickname = ref('');
export const userProfileImage = ref('');
export const defaultImage = '@/assets/gagunokugaLogo.png'; // 기본 이미지 경로

// 로그인 요청 함수
export const handleLogin = async () => {
    try {
        // 백엔드로 로그인 요청 보내기
        const response = await axios.post('/api/users/login', {
            email: email.value,
            password: password.value,
        });

        // 로그인 성공 시 받은 토큰을 처리
        const { accessToken } = response.data;
        console.log('로그인 성공', accessToken);

        // 로그인 상태 업데이트 (여기서는 예시로 닉네임과 프로필 이미지를 설정)
        isLoggedIn.value = true;
        userNickname.value = '홍길동'; // 예시 닉네임
        userProfileImage.value = ''; // 프로필 이미지 (없으면 기본 이미지로 설정)
    } catch (error) {
        console.error('로그인 실패', error);
    }
};

// 카카오 로그인
export const loginWithKakao = () => {
    Kakao.init('YOUR_KAKAO_JS_KEY');
    Kakao.Auth.login({
        success: function (authObj) {
            console.log('카카오 로그인 성공', authObj);
        },
        fail: function (error) {
            console.error('카카오 로그인 실패', error);
        }
    });
};

// 네이버 로그인
export const loginWithNaver = () => {
    const naverLogin = new naver.LoginWithNaverId({
        clientId: 'YOUR_NAVER_CLIENT_ID',
        callbackUrl: 'YOUR_CALLBACK_URL',
        isPopup: true,
        loginButton: { color: "green", type: 1, height: 48 }
    });

    naverLogin.init();
    naverLogin.getLoginStatus(function (status) {
        if (status) {
            const accessToken = naverLogin.getAccessToken();
            console.log('네이버 로그인 성공', accessToken);
        } else {
            console.log('네이버 로그인 실패');
        }
    });
};
