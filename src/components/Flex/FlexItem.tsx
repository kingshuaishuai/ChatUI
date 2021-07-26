import { defineComponent, ExtractPropTypes, PropType } from 'vue';

const flexItemProps = {
  flex: String,
  alignSelf: String as PropType<'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'>,
  order: Number
}

export type FlexItemProps = ExtractPropTypes<typeof flexItemProps>

export const FlexItem = defineComponent({
  name: 'FlexItem',
  props: flexItemProps,
  setup(props, {slots}) {
    return () => {
      const { flex, alignSelf, order } = props;
      return (
        <div
          class="FlexItem"
          style={{
            flex,
            alignSelf,
            order
          }}
        >
          { slots.default && slots.default()}
        </div>
      )
    }
  }
})
