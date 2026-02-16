import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppInput from '../AppInput.vue'

// Mock vee-validate
vi.mock('vee-validate', () => ({
  useField: vi.fn(() => ({
    value: '',
    errorMessage: '',
  })),
}))

// Mock Vuetify
const VTextField = {
  template: '<div class="v-text-field"><slot /></div>',
  props: ['modelValue', 'label', 'type', 'errorMessages', 'variant'],
}

describe('AppInput', () => {
  it('should render correctly with props', () => {
    const wrapper = mount(AppInput, {
      props: {
        name: 'test-field',
        type: 'text',
        label: 'Test Label',
      },
      global: {
        stubs: {
          'v-text-field': VTextField,
        },
      },
    })

    expect(wrapper.find('.v-text-field').exists()).toBe(true)
  })
})
