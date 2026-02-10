import { createRouter, createWebHashHistory } from 'vue-router'

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
    redirect: () => ({ name: 'Taxonomy', params: { taxonomy: 'areas' } }),
    children: [
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/taxonomies/CategoriesView.vue'),
      },
      {
        path: 'items',
        name: 'Items',
        component: () => import('@/views/taxonomies/CategoriesItemsView.vue'),
      },
      {
        path: ':taxonomy',
        name: 'Taxonomy',
        component: () => import('@/views/taxonomies/TaxonomyView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
