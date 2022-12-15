import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect : '/team',
    },
    {
      path: '/team',
      name: 'team',
      component: () => import('@/components/team.vue')
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
    },
    {
      path: '/item-list',
      name: 'item-list',
      component: () => import('@/components/item-list.vue')
    }
  ]
})

export default router
