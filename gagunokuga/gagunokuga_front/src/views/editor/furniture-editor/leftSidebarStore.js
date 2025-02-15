import { ref } from 'vue'
import { defineStore } from 'pinia'
import apiClient from '@/api/axiosInstance'

export const useLeftSidebarStore = defineStore('leftSidebarStore', () => {
    const furnitureList = ref([])
    const loading = ref(false)
    const error = ref(null)

    const fetchFurnitureList = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await apiClient.get('/api/furnitures')
            console.log(response.data)
            furnitureList.value = response.data.furnitures
        } catch (err) {
            error.value = '데이터를 불러오는 중 오류 발생'
        } finally {
            loading.value = false
        }
    }

    return {
        furnitureList,
        loading,
        error,
        fetchFurnitureList
    }
})