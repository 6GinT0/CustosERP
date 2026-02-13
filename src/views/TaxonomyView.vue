<script setup lang="ts">
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { taxonomyService } from '@/services/TaxonomyService'
import { taxonomySchema } from '@/schemas/taxonomy.schema'
import { useTaxonomy } from '@/composables/useTaxonomy'
import { useDatabase } from '@/composables/useDatabase'
import { typeOptions, typeLabels } from '@/constants/taxonomies'
import type { Taxonomy } from '@/types/Taxonomy'
// Components
import TaxonomyDataTable from '@/components/taxonomies/TaxonomyDataTable.vue'
import TaxonomyFormDialog from '@/components/taxonomies/TaxonomyFormDialog.vue'
import TaxonomyConfirmDialog from '@/components/taxonomies/TaxonomyConfirmDialog.vue'
import AppInput from '@/components/AppInput.vue'
import AppSelect from '@/components/AppSelect.vue'

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
  handleDeleteMany,
} = useTaxonomy<Taxonomy>(taxonomies)

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(taxonomySchema),
  initialValues: { type: 'AREA', name: '' },
})

const taxonomyHeaders = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'name' },
  { title: 'Tipo', key: 'type' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false },
]

const onSave = handleSubmit(async (values) => {
  if (action.value === 'create') {
    await handleCreate(() => taxonomyService.create(values as any), 'Registro creado con éxito')
  } else {
    if (!selectedItem.value) return

    await handleUpdate(
      () => taxonomyService.update({ ...selectedItem.value!, ...values } as any),
      'Registro actualizado con éxito',
    )
  }
})

const onConfirmDelete = async () => {
  if (action.value === 'remove' && selectedItem.value) {
    await handleDelete(
      selectedItem.value.id,
      () => taxonomyService.delete(selectedItem.value!.id),
      'Registro eliminado correctamente',
    )
  } else if (action.value === 'removeMany') {
    const ids = selected.value

    await handleDeleteMany(
      ids,
      () => taxonomyService.deleteMany(ids),
      'Registros eliminados correctamente',
    )
  }
}

watch(selectedItem, (newItem) => {
  resetForm({
    values: newItem ? { type: newItem.type, name: newItem.name } : { type: 'AREA', name: '' },
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
          :headers="taxonomyHeaders"
          :items="taxonomies"
          :filter-keys="['name', 'type']"
          :is-loading="isLoading"
          @create="create"
          @edit="edit"
          @remove="remove"
          @remove-many="removeMany"
        >
          <template v-slot:item.type="{ item }">
            <v-chip
              size="small"
              :color="item.type === 'AREA' ? 'indigo' : item.type === 'SECTOR' ? 'teal' : 'orange'"
            >
              {{ typeLabels[item.type] }}
            </v-chip>
          </template>
        </TaxonomyDataTable>
      </v-col>
    </v-row>

    <TaxonomyFormDialog
      v-if="action === 'create' || action === 'edit'"
      v-model:is-dialog-open="isDialogOpen"
      :action="action"
      :item="selectedItem"
      @cancel="cancel"
      @confirm="onSave"
    >
      <template #form>
        <form @submit.prevent="onSave">
          <AppSelect
            name="type"
            label="Tipo"
            :options="typeOptions"
            :selected-type="selectedItem?.type || 'AREA'"
          />
          <AppInput name="name" type="text" label="Nombre" />
        </form>
      </template>
    </TaxonomyFormDialog>

    <TaxonomyConfirmDialog
      v-else
      v-model:is-dialog-open="isDialogOpen"
      :label="action === 'remove' ? 'registro' : 'registros'"
      :action="action"
      :item="selectedItem"
      :items="selected"
      @cancel="cancel"
      @confirm="onConfirmDelete"
    />
  </v-container>
</template>
