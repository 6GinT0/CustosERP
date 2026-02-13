<script setup lang="ts">
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { categoryItemService } from '@/services/CategoryItemService'
import { categoryItemSchema } from '@/schemas/categoryItem.schema'
import { useTaxonomy } from '@/composables/useTaxonomy'
import { useDatabase } from '@/composables/useDatabase'
import type { CategoryItem } from '@/types/CategoryItem'
// Components
import TaxonomyDataTable from '@/components/taxonomies/TaxonomyDataTable.vue'
import TaxonomyFormDialog from '@/components/taxonomies/TaxonomyFormDialog.vue'
import TaxonomyConfirmDialog from '@/components/taxonomies/TaxonomyConfirmDialog.vue'
import AppInput from '@/components/AppInput.vue'
import AppSelect from '@/components/AppSelect.vue'

const { categories, categoryItems } = useDatabase()
const catOptions = categories.value.map((item: any) => ({
  title: item.name,
  value: item.id,
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
  handleDeleteMany,
} = useTaxonomy<CategoryItem>(categoryItems)

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(categoryItemSchema),
  initialValues: { categoryId: 1, name: '', lawReference: undefined },
})

const categoryHeaders = [
  { title: 'ID', key: 'id' },
  { title: 'Categoría', key: 'categoryId' },
  { title: 'Nombre', key: 'name' },
  { title: 'Legislación', key: 'lawReference' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false },
]

const onSave = handleSubmit(async (values) => {
  if (action.value === 'create') {
    await handleCreate(
      () => categoryItemService.create(values as any),
      'Categoría creada con éxito',
    )
  } else {
    if (!selectedItem.value) return

    await handleUpdate(
      () => categoryItemService.update({ ...selectedItem.value!, ...values } as any),
      'Categoría actualizada con éxito',
    )
  }
})

const onConfirmDelete = async () => {
  if (action.value === 'remove' && selectedItem.value) {
    await handleDelete(
      selectedItem.value.id,
      () => categoryItemService.delete(selectedItem.value!.id),
      'Categoría eliminada correctamente',
    )
  } else if (action.value === 'removeMany') {
    const ids = selected.value

    await handleDeleteMany(
      ids,
      () => categoryItemService.deleteMany(ids),
      'Categorías eliminadas correctamente',
    )
  }
}

watch(selectedItem, (newItem) => {
  resetForm({
    values: newItem
      ? { categoryId: newItem.categoryId, name: newItem.name, lawReference: newItem.lawReference }
      : { categoryId: 1, name: '', lawReference: undefined },
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
          :items="categoryItems"
          :filter-keys="['name', 'lawReference']"
          :is-loading="isLoading"
          @create="create"
          @edit="edit"
          @remove="remove"
          @remove-many="removeMany"
        >
          <template #item.categoryId="{ item }">
            {{ catOptions.find((option) => option.value === item.categoryId)?.title }}
          </template>
        </TaxonomyDataTable>
      </v-col>
    </v-row>

    <TaxonomyFormDialog
      v-if="action === 'create' || action === 'edit'"
      v-model:is-dialog-open="isDialogOpen"
      :action="action"
      type="items"
      :item="selectedItem"
      @cancel="cancel"
      @confirm="onSave"
    >
      <template #form>
        <form @submit.prevent="onSave">
          <AppSelect
            name="categoryId"
            label="Categoría"
            :options="catOptions"
            :selected-type="selectedItem?.categoryId ?? 1"
          />
          <AppInput name="name" type="text" label="Nombre" />
          <AppInput name="lawReference" type="text" label="Legislación" />
        </form>
      </template>
    </TaxonomyFormDialog>

    <TaxonomyConfirmDialog
      v-else
      v-model:is-dialog-open="isDialogOpen"
      label="item"
      :action="action"
      :item="selectedItem"
      :items="selected"
      @cancel="cancel"
      @confirm="onConfirmDelete"
    />
  </v-container>
</template>
