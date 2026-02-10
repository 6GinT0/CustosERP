<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const drawer = ref(true)
const rail = ref(true)

const navItems = [
  {
    title: 'Dashboard',
    icon: 'mdi-home',
    to: '/',
  },
  {
    title: 'Inspecciones',
    icon: 'mdi-clipboard-list-outline',
    to: '/inspections',
  },
  {
    title: 'Taxonomías',
    icon: 'mdi-database-outline',
    children: [
      {
        title: 'Zonas',
        icon: 'mdi-map-marker-radius-outline',
        to: { name: 'Taxonomy', params: { taxonomy: 'areas' } },
      },
      {
        title: 'Sectores',
        icon: 'mdi-office-building-outline',
        to: { name: 'Taxonomy', params: { taxonomy: 'sectors' } },
      },
      {
        title: 'Categorías',
        icon: 'mdi-shape-outline',
        to: '/taxonomies/categories',
      },
      {
        title: 'Items',
        icon: 'mdi-tag-multiple-outline',
        to: '/taxonomies/items',
      },
      {
        title: 'Motivos',
        icon: 'mdi-comment-question-outline',
        to: { name: 'Taxonomy', params: { taxonomy: 'reasons' } },
      },
    ],
  },
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
          <v-list-item title="Insight360">
            <template #prepend>
              <v-avatar size="32">
                <v-img src="/logo.png" alt="Tauri Logo" contain />
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
                  :active="isActiveTaxonomyGroup(item)"
                  :color="isActiveTaxonomyGroup(item) ? 'indigo-darken-3' : ''"
                />
              </template>
              <v-list-item
                v-for="(child, j) in item.children"
                :key="j"
                :prepend-icon="child.icon"
                :title="child.title"
                :to="child.to"
                :active="isActive(child.to)"
                :color="isActive(child.to) ? 'indigo-darken-3' : ''"
              />
            </v-list-group>

            <v-list-item
              v-else
              :prepend-icon="item.icon"
              :title="item.title"
              :to="item.to"
              :active="isActive(item.to)"
              :color="isActive(item.to) ? 'indigo-darken-3' : ''"
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
