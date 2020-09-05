import VueRouter from 'vue-router';

export default new VueRouter({
    routes: [
      { 
        path: '/',
        name: 'home',
        component: () => import('../views/home.vue')
      },
      { 
        path: '/find',
        name: 'find',
        component: () => import('../views/find.vue')
      },
      { 
        path: '/about',
        name: 'about',
        component: () => import('../views/about.vue')
      }
    ]
  })
