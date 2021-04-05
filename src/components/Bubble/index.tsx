import { defineComponent, ExtractPropTypes, PropType, VNode } from 'vue';

const bubbleProps= {
  type: {
    type: String,
    default: 'text'
  },
  content: {
    type: Object as PropType<VNode>,
  }
}

export type BubbleProps = ExtractPropTypes<typeof bubbleProps>

export const Bubble = defineComponent({
  name: 'Bubble',
  props: bubbleProps,
  setup(props, { slots }) {
    return () => {
      const { type, content } = props
      return (
        <div class={`Bubble ${type}`} data-type={type}>
          { 
            content 
            ? <p>{content}</p>
            : slots.content && <p>{slots.content()}</p>
          }
          { slots.default && slots.default() }
        </div>
      )
    }
  }
})
