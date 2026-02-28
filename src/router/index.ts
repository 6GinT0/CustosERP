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
      {
        path: 'add',
        name: 'AddInspection',
        component: () => import('@/views/inspections/AddInspectionView.vue'),
      },
      {
        path: 'edit/:id',
        name: 'EditInspection',
        component: () => import('@/views/inspections/EditInspectionView.vue'),
      },
    ],
  },
  {
    path: '/companies',
    name: 'Companies',
    component: () => import('@/views/companies/IndexView.vue'),
    children: [
      {
        path: 'add',
        name: 'AddCompany',
        component: () => import('@/views/companies/AddCompanyView.vue'),
      },
      {
        path: 'edit/:id',
        name: 'EditCompany',
        component: () => import('@/views/companies/EditCompanyView.vue'),
      },
    ],
  },
  {
    path: '/professionals',
    name: 'Professionals',
    component: () => import('@/views/professionals/IndexView.vue'),
    children: [
      {
        path: 'add',
        name: 'AddProfessional',
        component: () => import('@/views/professionals/AddProfessionalView.vue'),
      },
      {
        path: 'edit/:id',
        name: 'EditProfessional',
        component: () => import('@/views/professionals/EditProfessionalView.vue'),
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
