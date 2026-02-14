<script setup lang="ts">
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { categoryService } from '@/services/CategoryService'
import { categorySchema } from '@/schemas/category.schema'
import { useTaxonomy } from '@/composables/useTaxonomy'
import { useDatabase } from '@/composables/useDatabase'
import type { Category } from '@/types/Category'
// Components
import TaxonomyDataTable from '@/components/taxonomies/TaxonomyDataTable.vue'
import TaxonomyFormDialog from '@/components/taxonomies/TaxonomyFormDialog.vue'
import TaxonomyConfirmDialog from '@/components/taxonomies/TaxonomyConfirmDialog.vue'
import TaxonomyConfirmBulkDialog from '@/components/taxonomies/TaxonomyConfirmBulkDialog.vue'
import AppInput from '@/components/AppInput.vue'
import AppTextarea from '@/components/AppTextarea.vue'

const { categories } = useDatabase()

const {
  isDialogOpen,
  selectedItem,
  selected,
  search,
  isLoading,
  action,
  create,
  edit,
  remove,
  removeMany,
  cancel,
  handleCreate,
  handleUpdate,
  handleDelete,
  handleDeleteMany,
} = useTaxonomy<Category>(categories)

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(categorySchema),
  initialValues: { name: '', description: undefined },
})

const categoryHeaders = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'name' },
  { title: 'Descripción', key: 'description' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false },
]

const onSave = handleSubmit(async (values) => {
  if (selectedItem.value) {
    await handleUpdate(
      () => categoryService.update({ ...selectedItem.value!, ...values } as any),
      'Categoría actualizada con éxito',
    )
  } else {
    await handleCreate(() => categoryService.create(values as any), 'Categoría creada con éxito')
  }
})

const onConfirmDelete = async () => {
  await handleDelete(
    selectedItem.value.id,
    () => categoryService.delete(selectedItem.value!.id),
    'Categoría eliminada correctamente',
  )
}

const onConfirmDeleteMany = async () => {
  await handleDeleteMany(
    selected.value,
    () => categoryService.deleteMany(selected.value),
    'Categorías eliminadas correctamente',
  )
}

watch(selectedItem, (newItem) => {
  resetForm({
    values: newItem
      ? { name: newItem.name, description: newItem.description }
      : { name: '', description: undefined },
  })
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <TaxonomyDataTable
          v-model:search="search"
          v-model:selected="selected"
          :headers="categoryHeaders"
          :items="categories"
          :filter-keys="['name']"
          :is-loading="isLoading"
          @create="create"
          @edit="edit"
          @remove="remove"
          @remove-many="removeMany"
        />
      </v-col>
    </v-row>

    <TaxonomyFormDialog
      v-if="action === 'create' || action === 'edit'"
      v-model:is-dialog-open="isDialogOpen"
      label="Categoría"
      :item="selectedItem"
      @cancel="cancel"
      @confirm="onSave"
    >
      <template #form>
        <form @submit.prevent="onSave">
          <AppInput name="name" type="text" label="Nombre" />
          <AppTextarea name="description" label="Descripción" />
        </form>
      </template>
    </TaxonomyFormDialog>

    <TaxonomyConfirmDialog
      v-if="action === 'remove'"
      v-model:is-dialog-open="isDialogOpen"
      label="Categoría"
      :item="selectedItem"
      @cancel="cancel"
      @confirm="onConfirmDelete"
    />

    <TaxonomyConfirmBulkDialog
      v-if="action === 'removeMany'"
      v-model:is-dialog-open="isDialogOpen"
      label="Categoría"
      :items="selected"
      @cancel="cancel"
      @confirm="onConfirmDeleteMany"
    />
  </v-container>
</template>
