// import { Canvg } from 'canvg';
// import axiosInstance from "@/api/axiosInstance.js";
//
// export const captureScreen = async (canvasRef, roomId, baseURL) => {
//     if (!canvasRef || !canvasRef.value) {
//         console.error("canvasRef가 올바르지 않습니다.");
//         return;
//     }
//
//     const svgElement = canvasRef.value.querySelector("svg");
//     if (!svgElement) {
//         console.error("SVG 요소를 찾을 수 없습니다.");
//         return;
//     }
//
//     const { width, height } = svgElement.getBoundingClientRect();
//
//     const backgroundImage = await captureBackground(width, height);
//     const svgImage = await captureSVG(svgElement, width, height);
//     if (!svgImage) {
//         console.error("SVG 이미지를 캡처할 수 없습니다.");
//         return;
//     }
//
//     const combinedImageURL = await combineImages(backgroundImage, svgImage, width, height);
//     await uploadCapturedImage(combinedImageURL, roomId, baseURL);
// };
//
// const captureBackground = async (width, height) => {
//     const canvasElement = document.createElement('canvas');
//     const ctx = canvasElement.getContext('2d');
//     canvasElement.width = width;
//     canvasElement.height = height;
//
//     ctx.fillStyle = "#f0f0f0";
//     ctx.fillRect(0, 0, width, height);
//
//     return canvasElement.toDataURL("image/png");
// };
//
// // 서버 측에서 이미지를 다운로드하여 CORS 문제 해결
// const loadImageFromServer = async (url) => {
//     try {
//         console.log("요청 URL:", url);
//         const response = await axiosInstance.get(url, { responseType: 'blob' });
//         console.log("응답 데이터:", response);
//         return URL.createObjectURL(response.data);
//     } catch (error) {
//         console.error("이미지 로드 실패:", error.response?.data || error.message);
//         return null;
//     }
// };
//
// const captureSVG = async (svgElement, width, height) => {
//     if (!svgElement) return null;
//
//     // SVG 내부 <image> 태그에 crossOrigin 설정
//     const images = svgElement.querySelectorAll('image');
//     for (const image of images) {
//         const url = image.getAttribute('href');
//         const imageUrl = await loadImageFromServer(url);
//         image.setAttribute('href', imageUrl);  // 서버에서 처리된 URL로 변경
//     }
//
//     const canvasElement = document.createElement('canvas');
//     const ctx = canvasElement.getContext('2d');
//     canvasElement.width = width;
//     canvasElement.height = height;
//
//     const v = await Canvg.from(ctx, svgElement.outerHTML);
//     await v.render();
//
//     return canvasElement.toDataURL("image/png");
// };
//
// const loadImage = (url) => {
//     return new Promise((resolve, reject) => {
//         const img = new Image();
//         img.crossOrigin = 'anonymous';  // CORS 설정
//         img.onload = () => resolve(img);
//         img.onerror = (error) => reject(error);
//         img.src = url;
//     });
// };
//
// const combineImages = async (backgroundImageURL, svgImageURL, width, height) => {
//     const canvasElement = document.createElement('canvas');
//     const ctx = canvasElement.getContext('2d');
//     canvasElement.width = width;
//     canvasElement.height = height;
//
//     const backgroundImage = await loadImage(backgroundImageURL);
//     ctx.drawImage(backgroundImage, 0, 0, width, height);
//
//     const svgImage = await loadImage(svgImageURL);
//     ctx.drawImage(svgImage, 0, 0, width, height);
//
//     return canvasElement.toDataURL("image/png");
// };
//
// const convertBase64ToBlob = (base64Data) => {
//     const [header, base64] = base64Data.split(',');
//     const mime = header.match(/:(.*?);/)[1];
//     const binaryString = atob(base64);
//     const length = binaryString.length;
//     const uint8Array = new Uint8Array(length);
//
//     for (let i = 0; i < length; i++) {
//         uint8Array[i] = binaryString.charCodeAt(i);
//     }
//
//     return new Blob([uint8Array], { type: mime });
// };
//
// const uploadCapturedImage = async (imageURL, roomId, baseURL) => {
//     const formData = new FormData();
//     const blob = convertBase64ToBlob(imageURL);
//     formData.append('image', blob, 'comb_img.png');
//     formData.append('roomId', roomId);
//
//     try {
//         const response = await axiosInstance.post(`${baseURL}/api/rooms/capture`, formData, {
//             headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         console.log('이미지 업로드 성공:', response.data);
//     } catch (error) {
//         console.error('이미지 업로드 실패:', error);
//     }
// };
import { Canvg } from 'canvg';
import axiosInstance from "@/api/axiosInstance.js";

export const captureScreen = async (canvasRef, roomId, baseURL) => {
    console.log("1. captureScreen 함수 호출");

    if (!canvasRef || !canvasRef.value) {
        console.error("2. canvasRef가 올바르지 않습니다.");
        return;
    }

    const svgElement = canvasRef.value.querySelector("svg");
    if (!svgElement) {
        console.error("3. SVG 요소를 찾을 수 없습니다.");
        return;
    }

    const { width, height } = svgElement.getBoundingClientRect();
    console.log("4. SVG 크기:", width, height);

    const backgroundImage = await captureBackground(width, height);
    console.log("7. 배경 이미지 캡처 완료");

    const svgImage = await captureSVG(svgElement, width, height);
    console.log("14. SVG 이미지 캡처 완료");

    if (!svgImage) {
        console.error("14. SVG 이미지를 캡처할 수 없습니다.");
        return;
    }

    const combinedImageURL = await combineImages(backgroundImage, svgImage, width, height);
    console.log("21. 이미지 합성 완료");

    await uploadCapturedImage(combinedImageURL, roomId, baseURL);
    console.log("24. 캡처한 이미지 업로드 완료");
};

const captureBackground = async (width, height) => {
    console.log("5. 배경 캡처 시작");

    const canvasElement = document.createElement('canvas');
    const ctx = canvasElement.getContext('2d');
    canvasElement.width = width;
    canvasElement.height = height;

    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, width, height);

    const dataURL = canvasElement.toDataURL("image/png");
    console.log("6. 배경 캡처 완료");

    return dataURL;
};

const captureSVG = async (svgElement, width, height) => {
    console.log("8. SVG 캡처 시작");

    if (!svgElement) return null;

    const images = svgElement.querySelectorAll('image');
    for (const image of images) {
        const url = image.getAttribute('href');
        const imageUrl = await loadImageFromServer(url);
        image.setAttribute('href', imageUrl);
        console.log(`12. 이미지 href 수정 완료: ${url} -> ${imageUrl}`);
    }

    const canvasElement = document.createElement('canvas');
    const ctx = canvasElement.getContext('2d');
    canvasElement.width = width;
    canvasElement.height = height;

    const v = await Canvg.from(ctx, svgElement.outerHTML);
    await v.render();
    console.log("13. SVG 렌더링 완료");

    return canvasElement.toDataURL("image/png");
};

// 서버 측에서 이미지를 다운로드하여 CORS 문제 해결 못함.
const loadImageFromServer = async (url) => {
    console.log("9. 이미지 로드 시작:", url);
    try {
        const response = await axiosInstance.get(`/api/rooms/proxy`); // url의 이미지 데이터를 대용량 binary로 수령
        if (response.status === 200) {
            console.log("10. 이미지 로드 성공:", response);
            return URL.createObjectURL(response.data);
        }
        else {
            console.log(response.status.toString());
        }
    } catch (error) {
        console.error("11. 이미지 로드 실패:", error.response?.data || error.message);
        return null;
    }
};

const combineImages = async (backgroundImageURL, svgImageURL, width, height) => {
    console.log("17. 이미지 합성 시작");

    const canvasElement = document.createElement('canvas');
    const ctx = canvasElement.getContext('2d');
    canvasElement.width = width;
    canvasElement.height = height;

    const backgroundImage = await loadImage(backgroundImageURL);
    console.log("18. 배경 이미지 로드 완료");

    ctx.drawImage(backgroundImage, 0, 0, width, height);

    const svgImage = await loadImage(svgImageURL);
    console.log("19. SVG 이미지 로드 완료");

    ctx.drawImage(svgImage, 0, 0, width, height);

    const combinedImageURL = canvasElement.toDataURL("image/png");
    console.log("20. 이미지 합성 완료");

    return combinedImageURL;
};

const loadImage = (url) => {
    console.log("16x2. 이미지 로드 시작:", url);
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';  // CORS 설정
        img.onload = () => {
            console.log("17x2이미지 로드 성공:", url);
            resolve(img);
        };
        img.onerror = (error) => {
            console.error("17x2이미지 로드 실패:", url, error);
            reject(error);
        };
        img.src = url;
    });
};

const convertBase64ToBlob = (base64Data) => {
    console.log("Base64 데이터를 Blob으로 변환 시작");

    const [header, base64] = base64Data.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binaryString = atob(base64);
    const length = binaryString.length;
    const uint8Array = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }

    console.log("Base64 데이터 변환 완료");

    return new Blob([uint8Array], { type: mime });
};

const uploadCapturedImage = async (imageURL, roomId, baseURL) => {
    console.log("22. 이미지 업로드 시작");

    const formData = new FormData();
    const blob = convertBase64ToBlob(imageURL);
    formData.append('image', blob, 'comb_img.png');
    formData.append('roomId', roomId);

    try {
        const response = await axiosInstance.post(`${baseURL}/api/rooms/capture`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('23. 이미지 업로드 성공:', response.data);
    } catch (error) {
        console.error('23. 이미지 업로드 실패:', error);
    }
};
