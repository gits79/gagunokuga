import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/home/Home.vue";
import Login from "@/views/login/Login.vue";
import SignUp from "@/views/signup/SignUp.vue";
import RoomList from "@/views/room-list/RoomList.vue";
import FloorPlanEditor from "@/views/floor-plan-editor/FloorPlanEditor.vue";
import OAuthCallback from "../views/login/OAuthCallback.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/floor-plan-editor", name: "FloorPlanEditor", component: FloorPlanEditor },
  { path: "/login", name: "Login", component: Login },
  { path: "/room-list", name: "RoomList", component: RoomList },
  { path: "/signup", name: "SignUp", component: SignUp },
  { path: '/oauth/callback', name: "OAuthCallback", component: OAuthCallback }
  { path: "/room", name: "Room", component: RoomList },
  { path: '/editor/:roomId', name: 'Editor', component: FloorPlanEditor },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
