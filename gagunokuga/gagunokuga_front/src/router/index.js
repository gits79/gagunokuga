import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/home/Home.vue";
import Login from "@/views/login/Login.vue";
import SignUp from "@/views/signup/SignUp.vue";
import RoomList from "@/views/room/Room.vue";
import FloorPlanEditor from "@/views/editor/Editor.vue";
import ArticleList from "../views/article/ArticleList.vue";

const routes = [
  { path: "/", name: "Home", component: Home, children: [{ path: "", name: "ArticleList", component: ArticleList}] },
  { path: "/login", name: "Login", component: Login },
  { path: "/signup", name: "SignUp", component: SignUp },
  { path: "/room", name: "Room", component: RoomList },
  { path: '/editor/:roomId', name: 'Editor', component: FloorPlanEditor },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
