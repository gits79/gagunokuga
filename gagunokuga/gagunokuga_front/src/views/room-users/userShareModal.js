import { ref, computed } from "vue";
import axios from "axios";
import { useLoginStore } from "@/views/login/login";
import { useRoute } from "vue-router";

const baseURL = import.meta.env.VITE_API_URL;

export default function useUserShare() {
  const loginStore = useLoginStore();
  const route = useRoute();
  const roomId = ref(route.params.roomId);
  const users = ref([]);
  const searchQuery = ref("");
  const searchResults = ref([]);
  const selectedUsers = ref([]);

  const defaultProfileImage = "@assets/gagunokugaLogo.png";

  const myNickname = computed(() => loginStore.state.nickname);

  const isHost = computed(() => {
    return users.value.some(
      (u) => u.nickname === myNickname.value && u.isHost
    );
  });

  // 프로젝트 내 사용자 목록 불러오기
  const fetchUsers = async () => {
    try {
      const token = loginStore.state.token;
      const response = await axios.get(`${baseURL}/api/rooms/${roomId.value}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      users.value = response.data.users;
    } catch (error) {
      console.error("사용자 목록 불러오기 실패:", error);
    }
  };

  // 전체 사용자 검색
  const searchUsers = async () => {
    if (!searchQuery.value.trim()) {
      searchResults.value = [];
      return;
    }
    try {
      const token = loginStore.state.token;
      const response = await axios.get(`${baseURL}/api/users/list`, {
        params: { keyword: searchQuery.value },
        headers: { Authorization: `Bearer ${token}` },
      });
      searchResults.value = response.data.users;
    } catch (error) {
      console.error("사용자 검색 실패:", error);
    }
  };

  // 선택된 사용자 관리
  const selectUser = (user) => {
    if (!selectedUsers.value.some((u) => u.nickname === user.nickname)) {
      selectedUsers.value.push(user);
    }
  };

  const removeSelectedUser = (user) => {
    selectedUsers.value = selectedUsers.value.filter(
      (u) => u.nickname !== user.nickname
    );
  };

  // 초대 기능
  const inviteUsers = async () => {
    try {
      const token = loginStore.state.token;
      await Promise.all(
        selectedUsers.value.map((user) =>
          axios.post(
            `${baseURL}/api/rooms/${roomId.value}/users`,
            { nickname: user.nickname },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
      selectedUsers.value = [];
      fetchUsers();
    } catch (error) {
      console.error("사용자 초대 실패:", error);
    }
  };

  // 강퇴(내보내기) 기능
  const kickUser = async (nickname) => {
    try {
      const token = loginStore.state.token;
      await axios.delete(`${baseURL}/api/rooms/${roomId.value}/users`, {
        data: { nickname },
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      console.error("사용자 강퇴 실패:", error);
    }
  };

  return {
    users,
    searchQuery,
    searchResults,
    searchUsers,
    selectedUsers,
    selectUser,
    removeSelectedUser,
    inviteUsers,
    fetchUsers,
    kickUser,
    defaultProfileImage,
    isHost,
  };
}
