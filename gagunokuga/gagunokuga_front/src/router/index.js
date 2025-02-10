import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/home/Home.vue";
import Login from "@/views/login/Login.vue";
import SignUp from "@/views/signup/SignUp.vue";
import RoomList from "@/views/room-list/RoomList.vue";
import FloorPlanEditor from "@/views/floor-plan-editor/FloorPlanEditor.vue";
import OAuthCallback from "../views/login/OAuthCallback.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
  { path: "/signup", name: "SignUp", component: SignUp },
  { path: '/oauth/callback', name: "OAuthCallback", component: OAuthCallback },
  { path: "/room-list", name: "RoomList", component: RoomList },
  { path: '/editor/:roomId', name: 'FloorPlanEditor', component: FloorPlanEditor },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
