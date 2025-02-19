import { defineStore } from "pinia";
import { ref, computed } from 'vue';
import apiClient from "@/api/axiosInstance";

export const useEditorStore = defineStore("editorStore", () => {
    const roomId = ref(null);
    const role = ref('');
    const isExistsFurniture = ref(false);
    const editorMode = ref('none');
    // const currentNickname = computed(() => loginStore.state.nickname);

    const initEditor = async (id) => {
        roomId.value = id;
        try {
            const response = await apiClient.get(`/api/rooms/${id}/furnitures/fetch`);
            const length = response.data.furnitureList.length;
            console.log("불러온 가구: ", response.data.furnitureList)
            if (0 < length) {
                isExistsFurniture.value = true;
            } else {
                isExistsFurniture.value = false;    
            }
        } catch (error) {
            console.error("Error fetching furniture:", error);
        }
    }

    const getRole = async (currentNickname) => {
        console.log("내 닉네임: ", currentNickname)
        try {
            const response = await apiClient.get(`/api/rooms/${roomId.value}/users`);
            role.value = '';
            response.data.users.forEach(roomUser => {
                const { nickname, isHost, profileImageUrl } = roomUser;
                if (currentNickname === nickname) {
                    if (isHost) {
                        role.value = 'host';
                    } else {
                        role.value = 'guest';
                    }
                }
            });
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const changeEditorMode = (mode) => {
        if (mode) {
            editorMode.value = mode;
            return;
        }
        if (role.value === 'host') {
            if (isExistsFurniture.value) {
                editorMode.value = 'furniture';
            } else {
                editorMode.value = 'floor';
            }
        } else if (role.value === 'guest') {
            editorMode.value = 'furniture';
        } else {
            editorMode.value = 'none'
        }
    };

    return {
        roomId,
        role,
        isExistsFurniture,
        editorMode,
        
        initEditor,
        getRole,
        changeEditorMode,
    };
});