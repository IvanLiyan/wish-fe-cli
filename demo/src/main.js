import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
Vue.config.productionTip = false;
import WT from '@wish/wt-vue';
import(/* webpackChunkName: "wt" */ '@wish/wt-vue/dist/wt-vue.min.css');
Vue.use(WT);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
