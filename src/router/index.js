import Vue from "vue"
import VueRouter from "vue-router"
Vue.use(VueRouter)
import Login from '../view/login/login'
var routes = [
    {
        path:'/',
        redirect:'/login'
    },
    {
        path:'/login',
        component:Login,
        name:'login'
    }
]
var router = new VueRouter({
    routes,
    mode: 'history',
})
export default  router
