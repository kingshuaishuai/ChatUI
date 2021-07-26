import clsx from 'clsx';
import { defineComponent, ExtractPropTypes, PropType } from 'vue';

const mapDirection = {
  row: 'Flex--d-r',
  'row-reverse': 'Flex--d-rr',
  column: 'Flex--d-c',
  'column-reverse': 'Flex--d-cr',
};

const mapWrap = {
  nowrap: 'Flex--w-n',
  wrap: 'Flex--w-w',
  'wrap-reverse': 'Flex--w-wr',
};

const mapJustify = {
  'flex-start': 'Flex--jc-fs',
  'flex-end': 'Flex--jc-fe',
  center: 'Flex--jc-c',
  'space-between': 'Flex--jc-sb',
  'space-around': 'Flex--jc-sa',
};

const mapAlign = {
  'flex-start': 'Flex--ai-fs',
  'flex-end': 'Flex--ai-fe',
  center: 'Flex--ai-c',
};

const flexProps = {
  as: {
    type: String as PropType<keyof HTMLElementTagNameMap>,
    default: 'div'
  },
  center: Boolean,
  inline: Boolean,
  direction: String as PropType<'row' | 'row-reverse' | 'column' | 'column-reverse'>,
  wrap: String as PropType<'nowrap' | 'wrap' | 'wrap-reverse'>,
  justify: String as PropType<'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'>,
  justifyContent: String as PropType<'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'>,
  align: String as PropType<'flex-start' | 'flex-end' | 'center'>,
  alignItems: String as PropType<'flex-start' | 'flex-end' | 'center'>
}

export type FlexProps = ExtractPropTypes<typeof flexProps>

export const Flex = defineComponent({
  name: 'Flex',
  props: flexProps,
  setup(props, {slots}) {

    return () => {
      const {
        as: Element,
        inline,
        center,
        direction,
        wrap,
        justifyContent,
        justify = justifyContent,
        alignItems,
        align = alignItems,
      } = props
      return (
        <Element
          class={clsx(
            'Flex',
            direction && mapDirection[direction],
            justify && mapJustify[justify],
            align && mapAlign[align],
            wrap && mapWrap[wrap],
            {
              'Flex--inline': inline,
              'Flex--center': center,
            },            
          )}
        >
          {slots.default && slots.default()}
        </Element>
      )
    }
  }
})
