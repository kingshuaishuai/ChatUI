import clsx from 'clsx';
import { defineComponent, inject, Teleport } from 'vue';

const popoverProps = {

}

export const Popover = defineComponent({
  name: 'Popover',
  inheritAttrs: false,
  setup(props, { attrs }) {
    const popoverToElement = inject('PopoverTo', document.body)
    return () => {
      return (
        <Teleport to={popoverToElement}>
          <div class={clsx('Popover')} {...attrs}></div>
        </Teleport>
      )
    }
  }
})
