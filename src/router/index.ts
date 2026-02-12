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

router.beforeEach((to, from, next) => {
  if (to.name === 'Taxonomy') {
    const allowedTaxonomies = ['areas', 'sectors', 'reasons']

    if (!allowedTaxonomies.includes(to.params.taxonomy as string)) {
      next({ name: 'NotFound' })

      return
    }
  }

  next()
})

export default router
