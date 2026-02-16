import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TaxonomyConfirmDialog from '../taxonomies/TaxonomyConfirmDialog.vue'

// Mock Vuetify components
const VDialog = {
  template: '<div v-if="modelValue" class="v-dialog"><slot /></div>',
  props: ['modelValue'],
}
const VCard = { template: '<div class="v-card"><slot /></div>' }
const VCardTitle = { template: '<div class="v-card-title"><slot /></div>' }
const VCardText = { template: '<div class="v-card-text"><slot /></div>' }
const VCardActions = { template: '<div class="v-card-actions"><slot /></div>' }
const VSpacer = { template: '<div class="v-spacer"></div>' }
const VBtn = {
  template: '<button class="v-btn" @click="$emit(\'click\')"><slot /></button>',
  props: ['color', 'variant'],
}
const VIcon = { template: '<i class="v-icon"></i>', props: ['color', 'icon'] }

describe('TaxonomyConfirmDialog', () => {
  it('should not be visible when isDialogOpen is false', () => {
    const wrapper = mount(TaxonomyConfirmDialog, {
      props: {
        label: 'test',
        item: null,
        isDialogOpen: false,
      },
      global: {
        stubs: {
          'v-dialog': VDialog,
          'v-card': VCard,
          'v-card-title': VCardTitle,
          'v-card-text': VCardText,
          'v-card-actions': VCardActions,
          'v-spacer': VSpacer,
          'v-btn': VBtn,
          'v-icon': VIcon,
        },
      },
    })

    expect(wrapper.find('.v-dialog').exists()).toBe(false)
  })

  it('should be visible and show item name when isDialogOpen is true', () => {
    const wrapper = mount(TaxonomyConfirmDialog, {
      props: {
        label: 'Categoría',
        item: { name: 'Item Test' },
        isDialogOpen: true,
      },
      global: {
        stubs: {
          'v-dialog': VDialog,
          'v-card': VCard,
          'v-card-title': VCardTitle,
          'v-card-text': VCardText,
          'v-card-actions': VCardActions,
          'v-spacer': VSpacer,
          'v-btn': VBtn,
          'v-icon': VIcon,
        },
      },
    })

    expect(wrapper.find('.v-dialog').exists()).toBe(true)
    expect(wrapper.text()).toContain('Eliminar Categoría')
    expect(wrapper.text()).toContain('Item Test')
  })

  it('should emit cancel event when cancel button is clicked', async () => {
    const wrapper = mount(TaxonomyConfirmDialog, {
      props: {
        label: 'test',
        item: null,
        isDialogOpen: true,
      },
      global: {
        stubs: {
          'v-dialog': VDialog,
          'v-card': VCard,
          'v-card-title': VCardTitle,
          'v-card-text': VCardText,
          'v-card-actions': VCardActions,
          'v-spacer': VSpacer,
          'v-btn': VBtn,
          'v-icon': VIcon,
        },
      },
    })

    await wrapper.findAll('.v-btn')[0].trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('should emit confirm event when delete button is clicked', async () => {
    const wrapper = mount(TaxonomyConfirmDialog, {
      props: {
        label: 'test',
        item: null,
        isDialogOpen: true,
      },
      global: {
        stubs: {
          'v-dialog': VDialog,
          'v-card': VCard,
          'v-card-title': VCardTitle,
          'v-card-text': VCardText,
          'v-card-actions': VCardActions,
          'v-spacer': VSpacer,
          'v-btn': VBtn,
          'v-icon': VIcon,
        },
      },
    })

    await wrapper.findAll('.v-btn')[1].trigger('click')
    expect(wrapper.emitted('confirm')).toBeTruthy()
  })
})
