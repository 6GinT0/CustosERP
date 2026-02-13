import { createRouter, createWebHashHistory } from 'vue-router'
import NotFound from '@/views/404.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/DashboardView.vue'),
  },
  {
    path: '/inspections',
    children: [
      {
        path: '',
        name: 'Inspections',
        component: () => import('@/views/inspections/IndexView.vue'),
      },
    ],
  },
  {
    path: '/taxonomies',
    name: 'Taxonomies',
    component: () => import('@/views/TaxonomyView.vue'),
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/views/CategoriesView.vue'),
  },
  {
    path: '/items',
    name: 'Items',
    component: () => import('@/views/CategoriesItemsView.vue'),
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: () => ({ name: 'NotFound' }),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
