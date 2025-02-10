import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/home/Home.vue";
import Login from "@/views/login/Login.vue";
import SignUp from "@/views/signup/SignUp.vue";
import Room from "@/views/room/Room.vue";
import Editor from "@/views/editor/Editor.vue";

const routes = [
  { path: "/", name: "Home", component: Home, meta: { showHeader: true }, },
  { path: "/login", name: "Login", component: Login, meta: { showHeader: true },  },
  { path: "/signup", name: "SignUp", component: SignUp, meta: { showHeader: true },  },
  { path: "/room", name: "Room", component: Room, meta: { showHeader: true },  },
  { path: '/editor/:roomId', name: 'Editor', component: Editor, meta: { showHeader: false },  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
