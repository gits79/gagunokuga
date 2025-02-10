import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/home/Home.vue";
import Login from "@/views/login/Login.vue";
import SignUp from "@/views/signup/SignUp.vue";
import RoomList from "@/views/room-list/RoomList.vue";
import FloorPlanEditor from "@/views/floor-plan-editor/FloorPlanEditor.vue";

const routes = [
  { path: "/", name: "Home", component: Home, meta: { showHeader: true }, },
  { path: "/login", name: "Login", component: Login, meta: { showHeader: true }, },
  { path: "/signup", name: "SignUp", component: SignUp, meta: { showHeader: true }, },
  { path: "/room-list", name: "RoomList", component: RoomList, meta: { showHeader: true }, },
  { path: '/editor/:roomId', name: 'FloorPlanEditor', component: FloorPlanEditor, meta: { showHeader: false }, },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
