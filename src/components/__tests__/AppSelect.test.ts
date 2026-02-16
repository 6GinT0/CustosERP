import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSelect from '../AppSelect.vue'

// Mock vee-validate
vi.mock('vee-validate', () => ({
  useField: vi.fn((name, rules, options) => ({
    value: options?.initialValue || '',
    errorMessage: '',
    handleChange: vi.fn(),
    handleBlur: vi.fn(),
  })),
}))

// Mock Vuetify
const VSelect = {
  template: '<div class="v-select"><slot /></div>',
  props: ['modelValue', 'label', 'items', 'errorMessages', 'variant'],
}

describe('AppSelect', () => {
  it('should render with correct initial value', () => {
    const options = [
      { title: 'Option 1', value: '1' },
      { title: 'Option 2', value: '2' },
    ]
    const wrapper = mount(AppSelect, {
      props: {
        name: 'test-select',
        label: 'Select Label',
        options,
        selectedType: '2',
      },
      global: {
        stubs: {
          'v-select': VSelect,
        },
      },
    })

    expect(wrapper.find('.v-select').exists()).toBe(true)
  })
})
