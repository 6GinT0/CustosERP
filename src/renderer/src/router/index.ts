import { createRouter, createWebHashHistory } from 'vue-router'
import NotFound from '@renderer/pages/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@renderer/pages/dashboard/Index.vue')
  },
  {
    path: '/inspections',
    children: [
      {
        path: '',
        name: 'Inspections',
        component: () => import('@renderer/pages/inspections/Index.vue')
      },
      {
        path: 'add',
        name: 'AddInspection',
        component: () => import('@renderer/pages/inspections/AddInspection.vue')
      },
      {
        path: 'edit/:id',
        name: 'EditInspection',
        component: () => import('@renderer/pages/inspections/EditInspection.vue')
      }
    ]
  },
  {
    path: '/companies',
    children: [
      {
        path: '',
        name: 'Companies',
        component: () => import('@renderer/pages/companies/Index.vue')
      },
      {
        path: 'add',
        name: 'AddCompany',
        component: () => import('@renderer/pages/companies/AddCompany.vue')
      },
      {
        path: 'edit/:id',
        name: 'EditCompany',
        component: () => import('@renderer/pages/companies/EditCompany.vue')
      }
    ]
  },
  {
    path: '/professionals',
    children: [
      {
        path: '',
        name: 'Professionals',
        component: () => import('@renderer/pages/professionals/Index.vue')
      },
      {
        path: 'add',
        name: 'AddProfessional',
        component: () => import('@renderer/pages/professionals/AddProfessional.vue')
      },
      {
        path: 'edit/:id',
        name: 'EditProfessional',
        component: () => import('@renderer/pages/professionals/EditProfessional.vue')
      }
    ]
  },
  {
    path: '/taxonomies',
    name: 'Taxonomies',
    component: () => import('@renderer/pages/taxonomies/Index.vue')
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@renderer/pages/categories/Index.vue')
  },
  {
    path: '/category-items',
    name: 'CategoryItems',
    component: () => import('@renderer/pages/categories/items/Index.vue')
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    meta: {
      layout: 'none'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: () => ({ name: 'NotFound' })
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
