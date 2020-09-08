import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
// 导入全局样式
import './assets/css/global.css'
import axios from 'axios'
Vue.prototype.$http = axios;
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
