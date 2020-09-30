import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
// 导入全局样式
import './assets/css/global.css'
import axios from 'axios'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
Vue.prototype.$http = axios;
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false
Vue.filter('dateFormat',function(originVal){
 const dt = new Date(originVal*1000)
 const y = dt.getFullYear()
 const m = (dt.getMonth()+1+'').padStart(2,
'0')
const d = (dt.getDate() + '').padStart(2, '0')
const hh = (dt.getHours() + '').padStart(2, '0')
const mm = (dt.getMinutes() + '').padStart(2, '0')
const ss = (dt.getSeconds() + '').padStart(2, '0')
return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
