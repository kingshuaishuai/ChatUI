import { computed, onMounted, Ref, ref, watch, watchEffect } from 'vue'
import { InputProps } from '..'
import { useCurrentLineHeight } from './useCurrentLineHeight'

export const useRows = (props: InputProps, inputRef: Ref<HTMLInputElement | HTMLTextAreaElement | null>) => {
  let initialRows = props.rows
  const minRows = computed(() => props.minRows)
  const maxRows = computed(() => props.maxRows)
  if (initialRows < minRows.value) {
    initialRows = minRows.value
  } else if (initialRows > maxRows.value) {
    initialRows = maxRows.value
  }
  const rows = ref(initialRows)

  const { lineHeight } = useCurrentLineHeight(inputRef)

  const modelValue = computed(() => props.modelValue)

  console.log('rows', rows.value)

  /**
   * 计算rows并设置给textarea
   * @returns
   */
  function updateRow() {
    if (!props.autoSize) return
    const input = inputRef.value
    if (!input) return

    const target = input as HTMLTextAreaElement

    const prevRows = target.rows
    target.rows = minRows.value

    if (props.placeholder) {
      target.placeholder = ''
    }

    const currentRows = target.scrollHeight / lineHeight.value
    if (currentRows === prevRows) {
      target.rows = currentRows
    }

    if (currentRows >= maxRows.value) {
      target.rows = maxRows.value
      target.scrollTop = target.scrollHeight
    }

    rows.value = currentRows < maxRows.value ? currentRows : maxRows.value
    target.rows = rows.value

    if (props.placeholder) {
      target.placeholder = props.placeholder
    }
  }

  onMounted(() => {
    console.log('mounted', inputRef.value)
    updateRow()
  })
  watch(modelValue, updateRow)

  return { initialRows, updateRow, modelValue }
}
