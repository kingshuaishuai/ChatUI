import { defineComponent } from 'vue';
import { IconButton, iconButtonProps } from '../IconButton'

export const Action = defineComponent({
  name: 'Action',
  props: {
    ...iconButtonProps,
    color: {
      ...iconButtonProps.color,
      default: ''
    }
  },
  inheritAttrs: false,
  setup(props, {attrs}) {
    return () => {
      return (
        <div class="Composer-actions" data-action-icon={props.icon}>
          <IconButton {...props} {...attrs}/>
        </div>
      )
    }
  }
})

