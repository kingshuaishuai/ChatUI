import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'

const getCurrentLineHeight = (input: HTMLInputElement | HTMLTextAreaElement) => {
  const { lineHeight } = getComputedStyle(input, null)
  const lh = Number(lineHeight.replace('px', ''))
  return lh
}

const onRenderHandler = (
  input: Ref<HTMLInputElement | HTMLTextAreaElement | null>,
  lineHeight: Ref<number>,
) => {
  const currentLineHeight = input.value ? getCurrentLineHeight(input.value) : lineHeight.value
  if (lineHeight.value !== currentLineHeight) {
    lineHeight.value = currentLineHeight
  }
}

export const useCurrentLineHeight = (input: Ref<HTMLInputElement | HTMLTextAreaElement | null>) => {
  const lineHeight = ref(21)
  const onRender = () => {
    onRenderHandler(input, lineHeight)
  }
  onMounted(onRender)
  return { lineHeight }
}
