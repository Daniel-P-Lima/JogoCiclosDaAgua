import Jogo from '@/components/Jogo.vue'
import TelaInicial from '@/components/TelaInicial.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'TelaInicial',
      component: TelaInicial,
    },
    {
      path: '/Jogo',
      name: 'Jogo',
      component: Jogo,
    },
  ],
})

export default router
