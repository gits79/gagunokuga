import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/home/Home.vue";
import Login from "@/views/login/Login.vue";
import SignUp from "@/views/signup/SignUp.vue";
import RoomList from "@/views/room/Room.vue";
import FloorPlanEditor from "@/views/editor/Editor.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
  { path: "/signup", name: "SignUp", component: SignUp },
  { path: "/room", name: "Room", component: RoomList },
  { path: '/editor/:roomId', name: 'Editor', component: FloorPlanEditor },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
