import { ref } from 'vue'
import { defineStore } from 'pinia'
import apiClient from '@/api/axiosInstance'

export const useLeftSidebarStore = defineStore('leftSidebarStore', () => {
    const furnitureList = ref([])
    const loading = ref(false)
    const error = ref(null)
    const searchKeyword = ref('')

    const fetchFurnitureList = async (keyword = '') => {
        loading.value = true
        error.value = null
        try {
            // 첫 페이지를 가져와서 전체 페이지 수 확인
            const firstResponse = await apiClient.get('/api/furnitures', {
                params: { 
                    page: 0,
                    keyword: keyword 
                }
            })
            
            const totalPages = firstResponse.data.totalPages
            furnitureList.value = firstResponse.data.furnitures

            // 나머지 페이지 데이터 가져오기
            const remainingRequests = []
            for (let page = 1; page < totalPages; page++) {
                remainingRequests.push(
                    apiClient.get('/api/furnitures', {
                        params: { 
                            page,
                            keyword 
                        }
                    })
                )
            }

            const responses = await Promise.all(remainingRequests)
            responses.forEach(response => {
                furnitureList.value = [...furnitureList.value, ...response.data.furnitures]
            })

        } catch (err) {
            console.error('API 오류:', err)
            error.value = '데이터를 불러오는 중 오류 발생'
        } finally {
            loading.value = false
        }
    }

    return {
        furnitureList,
        loading,
        error,
        searchKeyword,
        fetchFurnitureList
    }
})