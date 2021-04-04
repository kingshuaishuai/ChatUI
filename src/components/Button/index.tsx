import clsx from 'clsx';
import { defineComponent, ExtractPropTypes, PropType } from 'vue';

export type ButtonVariant = 'text';

export type ButtonSize = 'sm' | 'md' | 'lg';

export const buttonProps = {
  label: String,
  color: {
    type: String,
    default: 'primary'
  },
  variant: String as PropType<ButtonVariant>,
  size: String as PropType<ButtonSize>,
  block: Boolean,
  loading: Boolean,
  disabled: Boolean,
  onClick: Function as PropType<(event: MouseEvent) => void>
}

export type ButtonProps = ExtractPropTypes<typeof buttonProps>

function composeClass(type?: string) {
  return type && `Btn--${type}`;
}

export const Button =  defineComponent({
  name: 'Button',
  props: buttonProps,
  setup(props, { slots, attrs }) {
    function handleClick(e: MouseEvent) {
      if (!props.disabled && !props.loading && props.onClick) {
        props.onClick(e);
      }
    }


    return () => {
      const { label, color, variant, size, block, disabled } = props
      return (
        <button
          class={clsx(
            'Btn',
            composeClass(color),
            composeClass(variant),
            composeClass(size),
            { 'Btn--block': block }
          )}
          type="button"
          disabled={disabled}
          onClick={handleClick}
          {...attrs}
        >
          { label || (slots.default && slots.default())}
        </button>
      )
    }
  }
})
