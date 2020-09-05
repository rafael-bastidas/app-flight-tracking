//window.Vue = require('vue');
import Vue from 'vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';

//Load Files CSS of Bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/fontawesome';

// Install BootstrapVue and Vue, Vue-Router
Vue.use(VueRouter);
Vue.use(BootstrapVue);

import router from './routes/router';
import main from './main.vue';

const app = new Vue({
    el: '#myApp',
    router,
    render (h) { return h(main) }
});