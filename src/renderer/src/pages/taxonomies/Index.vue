<script setup lang="ts">
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { taxonomySchema } from '@renderer/schemas/taxonomy.schema'
import { useClassification } from '@renderer/composables/useClassification'
import { useDatabase } from '@renderer/composables/useDatabase'
import { typeOptions, typeLabels } from '@renderer/constants/taxonomies'
import type { Taxonomy } from '#/types/Taxonomy'
/** Components */
import ClassificationDataTable from '@renderer/components/ClassificationDataTable.vue'
import ConfirmDeleteDialog from '@renderer/components/form/actions/ConfirmDeleteDialog.vue'
import ConfirmBulkDialog from '@renderer/components/form/actions/ConfirmBulkDialog.vue'
import AppFormDialog from '@renderer/components/form/AppFormDialog.vue'
import AppInput from '@renderer/components/form/AppInput.vue'
import AppSelect from '@renderer/components/form/AppSelect.vue'

const { taxonomies } = useDatabase()

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
} = useClassification<Taxonomy>(taxonomies)

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(taxonomySchema),
  initialValues: { type: 'AREA', name: '' }
})

const taxonomyHeaders = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'name' },
  { title: 'Tipo', key: 'type' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const onSave = handleSubmit(async (values) => {
  if (selectedItem.value) {
    await handleUpdate(
      () => window.api.taxonomy.update({ ...selectedItem.value!, ...values }),
      'Registro actualizado con éxito'
    )
  } else {
    await handleCreate(() => window.api.taxonomy.create(values), 'Registro creado con éxito')
  }
})

const onConfirmDelete = async () => {
  await handleDelete(
    selectedItem.value.id,
    () => window.api.taxonomy.delete(selectedItem.value!.id),
    'Registro eliminado correctamente'
  )
}

const onConfirmDeleteMany = async () => {
  await handleDeleteMany(
    selected.value,
    () => window.api.taxonomy.deleteMany([...selected.value]),
    'Registros eliminados correctamente'
  )
}

watch(selectedItem, (newItem) => {
  resetForm({
    values: newItem ? { type: newItem.type, name: newItem.name } : { type: 'AREA', name: '' }
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
          :headers="taxonomyHeaders"
          :items="taxonomies"
          :filter-keys="['name', 'type']"
          :is-loading="isLoading"
          @create="create"
          @edit="edit"
          @remove="remove"
          @remove-many="removeMany"
        >
          <template #item.name="{ item }">
            <span class="text-uppercase">{{ item.name }}</span>
          </template>
          <template #item.type="{ item }">
            <v-chip
              size="small"
              :color="item.type === 'AREA' ? 'indigo' : item.type === 'SECTOR' ? 'teal' : 'orange'"
            >
              {{ typeLabels[item.type] }}
            </v-chip>
          </template>
        </ClassificationDataTable>
      </v-col>
    </v-row>

    <AppFormDialog
      v-if="action === 'create' || action === 'edit'"
      v-model:is-dialog-open="isDialogOpen"
      label="Registro"
      :item="selectedItem"
      @cancel="cancel"
      @confirm="onSave"
    >
      <template #form>
        <AppSelect
          name="type"
          label="Tipo"
          :options="typeOptions"
          :selected-type="selectedItem?.type || 'AREA'"
        />
        <AppInput name="name" type="text" label="Nombre" />
      </template>
    </AppFormDialog>

    <ConfirmDeleteDialog
      v-if="action === 'remove'"
      v-model:is-dialog-open="isDialogOpen"
      label="Registro"
      :item="selectedItem"
      @cancel="cancel"
      @confirm="onConfirmDelete"
    />

    <ConfirmBulkDialog
      v-if="action === 'removeMany'"
      v-model:is-dialog-open="isDialogOpen"
      label="Registro"
      :items="selected"
      @cancel="cancel"
      @confirm="onConfirmDeleteMany"
    />
  </v-container>
</template>
