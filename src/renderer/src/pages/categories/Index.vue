<script setup lang="ts">
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { categorySchema } from '@renderer/schemas/category.schema'
import { useClassification } from '@renderer/composables/useClassification'
import { useDatabase } from '@renderer/composables/useDatabase'
import type { Category } from '#/types/Category'
/** Components */
import ClassificationDataTable from '@renderer/components/ClassificationDataTable.vue'
import AppFormDialog from '@renderer/components/form/AppFormDialog.vue'
import ConfirmDeleteDialog from '@renderer/components/form/actions/ConfirmDeleteDialog.vue'
import ConfirmBulkDialog from '@renderer/components/form/actions/ConfirmBulkDialog.vue'
import AppInput from '@renderer/components/form/AppInput.vue'
import AppTextarea from '@renderer/components/form/AppTextarea.vue'

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
  handleDeleteMany
} = useClassification<Category>(categories)

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(categorySchema),
  initialValues: { name: '', description: undefined }
})

const categoryHeaders = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'name' },
  { title: 'Descripción', key: 'description' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const onSave = handleSubmit(async (values) => {
  if (selectedItem.value) {
    await handleUpdate(
      () => window.api.category.update({ ...selectedItem.value!, ...values }),
      'Categoría actualizada con éxito'
    )
  } else {
    await handleCreate(() => window.api.category.create(values), 'Categoría creada con éxito')
  }
})

const onConfirmDelete = async () => {
  await handleDelete(
    selectedItem.value.id,
    () => window.api.category.delete(selectedItem.value!.id),
    'Categoría eliminada correctamente'
  )
}

const onConfirmDeleteMany = async () => {
  await handleDeleteMany(
    selected.value,
    () => window.api.category.deleteMany([...selected.value]),
    'Categorías eliminadas correctamente'
  )
}

watch(selectedItem, (newItem) => {
  resetForm({
    values: newItem
      ? { name: newItem.name, description: newItem.description }
      : { name: '', description: undefined }
  })
})
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <ClassificationDataTable
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
        >
          <template #item.name="{ item }">
            <span class="text-uppercase">{{ item.name }}</span>
          </template>
        </ClassificationDataTable>
      </v-col>
    </v-row>

    <AppFormDialog
      v-if="action === 'create' || action === 'edit'"
      v-model:is-dialog-open="isDialogOpen"
      label="Categoría"
      :item="selectedItem"
      @cancel="cancel"
      @confirm="onSave"
    >
      <template #form>
        <AppInput name="name" type="text" label="Nombre" />
        <AppTextarea name="description" label="Descripción" />
      </template>
    </AppFormDialog>

    <ConfirmDeleteDialog
      v-if="action === 'remove'"
      v-model:is-dialog-open="isDialogOpen"
      label="Categoría"
      :item="selectedItem"
      @cancel="cancel"
      @confirm="onConfirmDelete"
    />

    <ConfirmBulkDialog
      v-if="action === 'removeMany'"
      v-model:is-dialog-open="isDialogOpen"
      label="Categoría"
      :items="selected"
      @cancel="cancel"
      @confirm="onConfirmDeleteMany"
    />
  </v-container>
</template>
