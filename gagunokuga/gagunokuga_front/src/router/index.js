import { createRouter, createWebHistory } from 'vue-router';
import MainView from "../views/MainView.vue";
import ArticlesView from "../components/article/ArticlesView.vue";
import LoginView from "../components/user/LoginView.vue";
import RoomView from "../components/room/RoomView.vue";
import SignupView from "../components/user/SignupView.vue";
import RoomViewItem from "../components/room/RoomViewItem.vue";
import WallEditor from "../components/room/editor/WallEditor.vue"; // 룸 수정 페이지

const routes = [
  { path: '/', component: MainView },
  { path: '/login', component: LoginView },
  { path: '/signup', component: SignupView },
  { path: '/room', component: RoomView },
  {
    path: '/room/:id',
    name: 'RoomViewItem',
    component: RoomViewItem,
    props: true, // URL의 파라미터를 컴포넌트의 props로 전달
  },
  {
    path: '/room/:id/wall', // 룸 수정 페이지 경로
    name: 'WallEditor',
    component: WallEditor, // 룸 에디터 페이지
    props: true, // URL 파라미터를 props로 전달
  },
  { path: '/articles', component: ArticlesView },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // process.env.BASE_URL -> import.meta.env.BASE_URL
  routes,
});

export default router;
