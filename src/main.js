import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css';
import {
  Message, MessageBox
} from 'element-ui';
import ElementUI from 'element-ui';
import store from './store';
import router from './router'
import {createTrtcCalling} from './trtc-calling';
import TRTCCalling from 'trtc-calling-js';
import App from './App.vue'
import axios from 'axios'

Vue.use(ElementUI)

axios.defaults.baseURL = 'http://localhost:8989';  // 默认地址
Vue.prototype.$http = axios
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.prototype.$trtcCalling = createTrtcCalling();
Vue.prototype.TrtcCalling = TRTCCalling;

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
