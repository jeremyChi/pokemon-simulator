import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/index.vue')
    },
    {
      path: '/pokemon-list',
      name: 'pokemon-list',
      component: () => import('@/components/pokemon-list.vue')
    },
    {
      path: '/move-list',
      name: 'move-list',
      component: () => import('@/components/move-list.vue')
    }
  ]
})

export default router
