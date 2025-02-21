import { Canvg } from 'canvg';
import axiosInstance from "@/api/axiosInstance.js";

export const captureScreen = async (canvasRef, roomId, baseURL) => {

    if (!canvasRef || !canvasRef.value) {
        return;
    }

    const svgElement = canvasRef.value.querySelector("svg");
    if (!svgElement) {
        return;
    }

    const { width, height } = svgElement.getBoundingClientRect();

    const backgroundImage = await captureBackground(width, height);

    const svgImage = await captureSVG(svgElement, width, height);

    if (!svgImage) {
        console.error("14. SVG 이미지를 캡처할 수 없습니다.");
        return;
    }

    const combinedImageURL = await combineImages(backgroundImage, svgImage, width, height);

    await uploadCapturedImage(combinedImageURL, roomId, baseURL);
};

const captureBackground = async (width, height) => {

    const canvasElement = document.createElement('canvas');
    const ctx = canvasElement.getContext('2d');
    canvasElement.width = width;
    canvasElement.height = height;

    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, width, height);

    const dataURL = canvasElement.toDataURL("image/png");

    return dataURL;
};

const captureSVG = async (svgElement, width, height) => {

    if (!svgElement) return null;

    const images = svgElement.querySelectorAll('image');
    for (const image of images) {
        const url = image.getAttribute('href');
        const imageUrl = await loadImageFromServer(url);
        image.setAttribute('href', imageUrl);
    }

    const canvasElement = document.createElement('canvas');
    const ctx = canvasElement.getContext('2d');
    canvasElement.width = width;
    canvasElement.height = height;

    const v = await Canvg.from(ctx, svgElement.outerHTML);
    await v.render();

    return canvasElement.toDataURL("image/png");
};

// 서버 측에서 이미지를 다운로드하여 CORS 문제 해결 못함.
const loadImageFromServer = async (url) => {
    try {
        // CORS 문제를 해결하지 못하는 경우 빈 이미지 반환
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgAB/ej/fh8AAAAASUVORK5CYII=";
    } catch (error) {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgAB/ej/fh8AAAAASUVORK5CYII=";
    }
    /*try {
        const response = await axiosInstance.get(`/api/rooms/proxy`); // url의 이미지 데이터를 대용량 binary로 수령
        if (response.status === 200) {
            return URL.createObjectURL(response.data);
        }
        else {
        }
    } catch (error) {
        return null;
    }*/
};

const combineImages = async (backgroundImageURL, svgImageURL, width, height) => {

    const canvasElement = document.createElement('canvas');
    const ctx = canvasElement.getContext('2d');
    canvasElement.width = width;
    canvasElement.height = height;

    const backgroundImage = await loadImage(backgroundImageURL);

    ctx.drawImage(backgroundImage, 0, 0, width, height);

    const svgImage = await loadImage(svgImageURL);

    ctx.drawImage(svgImage, 0, 0, width, height);

    const combinedImageURL = canvasElement.toDataURL("image/png");

    return combinedImageURL;
};

const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';  // CORS 설정
        img.onload = () => {
            resolve(img);
        };
        img.onerror = (error) => {
            reject(error);
        };
        img.src = url;
    });
};

const convertBase64ToBlob = (base64Data) => {

    const [header, base64] = base64Data.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binaryString = atob(base64);
    const length = binaryString.length;
    const uint8Array = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }


    return new Blob([uint8Array], { type: mime });
};

const uploadCapturedImage = async (imageURL, roomId, baseURL) => {

    const formData = new FormData();
    const blob = convertBase64ToBlob(imageURL);
    formData.append('image', blob, 'comb_img.png');
    formData.append('roomId', roomId);

    try {
        const response = await axiosInstance.post(`${baseURL}/api/rooms/capture`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    } catch (error) {
        console.error('23. 이미지 업로드 실패:', error);
    }
};
