import Vue from "vue"
import VueRouter from "vue-router"
Vue.use(VueRouter)
import Login from '../view/login/login'
import Home from '../view/Home/home'
// import weCome from '../view/Home/welCome'
const weCome  = ()=>import('../view/Home/welCome') 
const user  = ()=>import('../view/User/user') 
const rights = ()=>import('../view/Power/power') 
const roules = ()=>import('../view/Power/roules') 
const goods = ()=>import('../view/Goods/goods') 
const params = ()=>import('../view/Goods/params') 
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
        name:'Home',
        redirect:'/users',
        children:[
            {
             path:'/weCome',
             component:weCome
            },{
                path:'/users',
                component:user
            },{
                path:'/rights',
                component:rights
            },{
                path:'/roles',
                component:roules
            },{
                path:'/categories',
                component:goods
            }
            ,{
                path:'/params',
                component:params
                
            }
        ]
    },
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
