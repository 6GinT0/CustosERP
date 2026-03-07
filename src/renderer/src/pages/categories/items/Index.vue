<script setup lang="ts">
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { categoryItemSchema } from '@renderer/schemas/category-item.schema'
import { useClassification } from '@renderer/composables/useClassification'
import { useDatabase } from '@renderer/composables/useDatabase'
import type { CategoryItem } from '#/types/category-item'
/** Components */
import ClassificationDataTable from '@renderer/components/ClassificationDataTable.vue'
import AppFormDialog from '@renderer/components/form/AppFormDialog.vue'
import ConfirmDeleteDialog from '@renderer/components/form/actions/ConfirmDeleteDialog.vue'
import ConfirmBulkDialog from '@renderer/components/form/actions/ConfirmBulkDialog.vue'
import AppInput from '@renderer/components/form/AppInput.vue'
import AppSelect from '@renderer/components/form/AppSelect.vue'

const { categories, categoryItems } = useDatabase()
const catOptions = categories.value.map((item: any) => ({
  title: item.name,
  value: item.id
}))

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
} = useClassification<CategoryItem>(categoryItems)

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(categoryItemSchema),
  initialValues: { category_id: 1, name: '', law_reference: undefined }
})

const categoryHeaders = [
  { title: 'ID', key: 'id' },
  { title: 'Categoría', key: 'category_id' },
  { title: 'Nombre', key: 'name' },
  { title: 'Legislación', key: 'law_reference' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const onSave = handleSubmit(async (values) => {
  if (selectedItem.value) {
    await handleUpdate(
      () => window.api.categoryItem.update({ ...selectedItem.value!, ...values }),
      'Categoría actualizada con éxito'
    )
  } else {
    await handleCreate(() => window.api.categoryItem.create(values), 'Categoría creada con éxito')
  }
})

const onConfirmDelete = async () => {
  await handleDelete(
    selectedItem.value.id,
    () => window.api.categoryItem.delete(selectedItem.value!.id),
    'Categoría eliminada correctamente'
  )
}

const onConfirmDeleteMany = async () => {
  await handleDeleteMany(
    selected.value,
    () => window.api.categoryItem.deleteMany([...selected.value]),
    'Categorías eliminadas correctamente'
  )
}

watch(selectedItem, (newItem) => {
  resetForm({
    values: newItem
      ? {
          category_id: newItem.category_id,
          name: newItem.name,
          law_reference: newItem.law_reference
        }
      : { category_id: 1, name: '', law_reference: undefined }
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
          :items="categoryItems"
          :filter-keys="['name', 'lawReference']"
          :is-loading="isLoading"
          @create="create"
          @edit="edit"
          @remove="remove"
          @remove-many="removeMany"
        >
          <template #item.category_id="{ item }">
            <span class="text-uppercase">
              {{ catOptions.find((option) => option.value === item.category_id)?.title }}
            </span>
          </template>
          <template #item.name="{ item }">
            <span class="text-uppercase">{{ item.name }}</span>
          </template>
          <template #item.law_reference="{ item }">
            <span class="text-uppercase">{{ item.law_reference }}</span>
          </template>
        </ClassificationDataTable>
      </v-col>
    </v-row>

    <AppFormDialog
      v-if="action === 'create' || action === 'edit'"
      v-model:is-dialog-open="isDialogOpen"
      label="Item"
      :item="selectedItem"
      @cancel="cancel"
      @confirm="onSave"
    >
      <template #form>
        <AppSelect
          name="category_id"
          label="Categoría"
          :options="catOptions"
          :selected-type="selectedItem?.category_id ?? 1"
        />
        <AppInput name="name" type="text" label="Nombre" />
        <AppInput name="law_reference" type="text" label="Legislación" />
      </template>
    </AppFormDialog>

    <ConfirmDeleteDialog
      v-if="action === 'remove'"
      v-model:is-dialog-open="isDialogOpen"
      label="Item"
      :item="selectedItem"
      @cancel="cancel"
      @confirm="onConfirmDelete"
    />

    <ConfirmBulkDialog
      v-if="action === 'removeMany'"
      v-model:is-dialog-open="isDialogOpen"
      label="Item"
      :items="selected"
      @cancel="cancel"
      @confirm="onConfirmDeleteMany"
    />
  </v-container>
</template>
