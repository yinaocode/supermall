import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 导入全局样式
import './assets/css/global.css'

// 导入进度条包Nprogress的js和css
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from 'axios'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
Vue.prototype.$http = axios;
// 在request拦截器，展示进度条
axios.interceptors.request.use(config=>{
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在response拦截器中，关闭进度条
axios.interceptors.response.use(config=>{
  Nprogress.done()
  return config
})
Vue.config.productionTip = false
// 注册富文本编辑器
Vue.use(VueQuillEditor, /* { default global options } */)
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
