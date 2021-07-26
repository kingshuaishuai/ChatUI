import { defineComponent, ExtractPropTypes } from 'vue';
import clsx from 'clsx'
import { required } from '../../utils/fixVueProps';

const iconProps = {
  type: {
    type: String,
    required: required
  },
  name: String,
  spin: Boolean
}

export type IconProps = ExtractPropTypes<typeof iconProps>

export const Icon = defineComponent({
  name: 'Icon',
  props: iconProps,
  setup(props) {
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
        >
          <use xlinkHref={`#icon-${type}`}/>
        </svg>
      )
    }
  }
})
