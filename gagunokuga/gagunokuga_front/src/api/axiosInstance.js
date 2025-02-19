import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json', // 기본 Content-Type 설정
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
});

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // FormData가 있는 경우 Content-Type을 multipart/form-data로 설정
        if (config.data instanceof FormData) {
            // FormData가 있으면 자동으로 Content-Type을 multipart/form-data로 설정
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
