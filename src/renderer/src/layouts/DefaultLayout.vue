<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import icon from '#/resources/icon.png'

const route = useRoute()

const drawer = ref(true)
const rail = ref(true)

type NavItem = {
  title: string
  icon: string
  to?: string | { name: string; params: Record<string, string> }
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    icon: 'mdi-home',
    to: '/'
  },
  {
    title: 'Inspecciones',
    icon: 'mdi-clipboard-list-outline',
    to: '/inspections'
  },
  {
    title: 'Empresas',
    icon: 'mdi-office-building-outline',
    to: '/companies'
  },
  {
    title: 'Profesionales',
    icon: 'mdi-account-outline',
    to: '/professionals'
  },
  {
    title: 'Categorías',
    icon: 'mdi-shape-outline',
    to: '/categories'
  },
  {
    title: 'Items',
    icon: 'mdi-tag-multiple-outline',
    to: '/category-items'
  },
  {
    title: 'Taxonomías',
    icon: 'mdi-graph-outline',
    to: '/taxonomies'
  }
]

const isActive = (path: string | { name: string; params: { [key: string]: string } }) => {
  if (typeof path === 'string') {
    return route.path === path
  } else {
    // For dynamic routes like /taxonomies/:taxonomy
    return (
      route.name === path.name &&
      Object.keys(path.params).every((key) => route.params[key] === path.params[key])
    )
  }
}

const isActiveTaxonomyGroup = (item: any) => {
  if (!item.children) return false
  return item.children.some((child: any) => isActive(child.to))
}
</script>

<template>
  <v-responsive>
    <v-app class="bg-grey-lighten-5">
      <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
        <v-list>
          <v-list-item title="CustosERP">
            <template #prepend>
              <v-avatar size="32">
                <v-img :src="icon" alt="CustosERP Logo" contain />
              </v-avatar>
            </template>
          </v-list-item>

          <template #append>
            <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail" />
          </template>
        </v-list>

        <v-divider />

        <v-list density="compact" nav>
          <template v-for="(item, i) in navItems" :key="i">
            <v-list-group v-if="item.children" :value="item.title">
              <template #activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :prepend-icon="item.icon"
                  :title="item.title"
                  :class="isActiveTaxonomyGroup(item) ? 'bg-indigo-lighten-5' : ''"
                  :active="isActiveTaxonomyGroup(item)"
                  :color="isActiveTaxonomyGroup(item) ? 'indigo-darken-3' : ''"
                />
              </template>
              <v-list-item
                v-for="(child, j) in item.children"
                v-show="child.to"
                :key="j"
                :prepend-icon="child.icon"
                :title="child.title"
                :to="child.to!"
                :active="child.to ? isActive(child.to) : false"
                :color="child.to && isActive(child.to) ? 'indigo-darken-3' : ''"
              />
            </v-list-group>

            <v-list-item
              v-else-if="item.to"
              :prepend-icon="item.icon"
              :title="item.title"
              :to="item.to!"
              :active="isActive(item.to!)"
              :color="isActive(item.to!) ? 'indigo-darken-3' : ''"
            />
          </template>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar flat class="border-b">
        <v-app-bar-nav-icon @click.stop="rail = !rail" />
      </v-app-bar>

      <v-main>
        <v-container fluid>
          <slot />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>
