import { defineComponent, ExtractPropTypes, onMounted, onUnmounted, PropType, ref } from 'vue'
import { required } from '../../utils/fixVueProps'

/**
 * 缓存dom节点，提高访问性能
 */
const doc = document
const html = doc.documentElement


const clickOutsideProps = {
  onClick: {
    type: Function as PropType< (event: MouseEvent) => void>,
    required
  },
  mouseEvent: String as PropType<'click' | 'mousedown' | 'mouseup'>
}

export type ClickOutsideProps = ExtractPropTypes<typeof clickOutsideProps>

export const ClickOutside = defineComponent({
  name: 'ClickOutside',
  props: clickOutsideProps,
  setup(props, { slots }) {
    const wrapper = ref<HTMLElement | null>(null)

    function handleClick(e: any) {
      if (!wrapper.value) return;

      if (html.contains(e.target) && !wrapper.value.contains(e.target)) {
        props.onClick(e);
      }
    }

    onMounted(() => {
      const { mouseEvent = 'mouseup' } = props
      if (mouseEvent) {
        doc.addEventListener(mouseEvent, handleClick)
      }
    })

    onUnmounted(() => {
      const { mouseEvent = 'mouseup' } = props
      if (mouseEvent) {
        doc.removeEventListener(mouseEvent, handleClick)
      }
    })

    return () => {
      return (
        <div onClick={handleClick} ref={wrapper}>{slots.default && slots.default()}</div>
      )
    }
  }
})
