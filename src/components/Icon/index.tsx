import { defineComponent, ExtractPropTypes } from 'vue';
import clsx from 'clsx'

const iconProps = {
  type: {
    type: String,
    required: true
  },
  name: String,
  spin: String
}

export type IconProps = ExtractPropTypes<typeof iconProps>

export const Icon = defineComponent({
  name: 'Icon',
  props: iconProps,
  setup(props, {attrs}) {
    return () => {
      const { type, spin, name } = props
      const ariaProps = typeof name === 'string' ? { 'aria-label': name } : { 'aria-hidden': true };

      return (
        <svg
          class={clsx(
            'Icon',
            { 'is-spin': spin }
          )}
          {...ariaProps}
          {...attrs}
        >
          <use xlinkHref={`#icon-${type}`}/>
        </svg>
      )
    }
  }
})
