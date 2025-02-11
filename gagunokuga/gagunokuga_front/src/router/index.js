import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/home/Home.vue";
import Login from "@/views/login/Login.vue";
import SignUp from "@/views/signup/SignUp.vue";
import Room from "@/views/room/Room.vue";
import Editor from "@/views/editor/Editor.vue";
import OAuthCallback from "@/views/login/OAuthCallback.vue";
import OAuthSuccess from "../views/login/OAuthSuccess.vue";
import PwdCheck from "../views/mypage/Passwordcheck.vue";
import MyPage from "../views/mypage/Mypage.vue";
import ArticleList from "../views/article/ArticleList.vue";
import ArticleDetail from "../views/article/ArticleDetail.vue";




const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: "/",
      name: "Home",
      component: Home,
      children: [
        {
          path: "",
          name: "ArticleList",
          component: ArticleList
        },
        {
          path: "/article/:articleId",
          name: "ArticleDetail",
          component: ArticleDetail
        },
      ]
    },
    { path: "/login", name: "Login", component: Login },
    { path: "/room", name: "Room", component: Room },
    { path: '/editor/:roomId', name: 'Editor', component: Editor },
    { path: "/signup", name: "SignUp", component: SignUp },
    { path: "/oauth/success", name: "OAuthSuccess", component: OAuthSuccess},
    { path: "/pwdcheck", name: "PasswordCheck", component: PwdCheck, meta: { showHeader: true }, },
    { path: "/mypage", name: "MyPage", component: MyPage, meta: { showHeader: true }, },

    // {
    //   path: '/oauth/callback',
    //   name: "OAuthCallback",
    //   component: OAuthCallback,
    //   beforeEnter: (to, from, next) => {
    //     // URL에서 토큰 파라미터 가져오기
    //     const fullPath = window.location.href;
    //     const searchParams = new URL(fullPath).searchParams;

    //     // 토큰 추출
    //     const accessToken = searchParams.get('accessToken');
    //     const refreshToken = searchParams.get('refreshToken');

    //     // 파라미터를 라우트 쿼리에 추가
    //     to.query = {
    //       accessToken,
    //       refreshToken
    //     };

    //     next();
    //   }
    // }
  ]
});

// OAuth 콜백 URL을 처리하기 위한 전역 리스너는 그대로 유지
window.addEventListener('load', () => {
  const fullPath = window.location.href;
  if (fullPath.includes('/oauth/callback')) {
    const url = new URL(fullPath);

    console.log("Original URL:", fullPath);
    console.log("Search params:", url.search);
    window.location.href = `/oauth/success${url.search}`;
    
  }
});

export default router;
