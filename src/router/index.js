import Vue from "vue"
import VueRouter from "vue-router"
Vue.use(VueRouter)
import Login from '../view/login/login'
import Home from '../view/Home/home'
var routes = [
    {
        path:'/',
        redirect:'/login'
    },
    {
        path:'/login',
        component:Login,
        name:'login'
    },{
        path:'/home',
        component:Home,
        name:'Home'
    }
]
var router = new VueRouter({
    routes,
    mode: 'history',
})
router.beforeEach((to, from, next) => {
    if(to.path=='/login')return next();
     const token = window.sessionStorage.getItem('token');
        if(!token)return next('/login');
            next()
  })
export default  router
