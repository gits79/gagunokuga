import axios from 'axios';

// 기본 설정 (백엔드 API 주소 설정)
const api = axios.create({
    baseURL: 'http://localhost:8080/api', // 백엔드 서버의 주소로 수정
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;