import { defineComponent, ExtractPropTypes } from 'vue';
import { Button, buttonProps } from '../Button'
import { Icon } from '../Icon';

const iconButtonProps = {
  ...buttonProps,
  icon: String
}

export type IconButtonProps = ExtractPropTypes<typeof iconButtonProps>

export const IconButton = defineComponent({
  name: 'IconButton',
  props: iconButtonProps,
  setup(props, { attrs }) {
    return () => {
      const { icon, ...others } = props;
      return (
        <Button class="IconBtn" {...others} {...attrs}>
          <Icon type={icon}/>
        </Button>
      )
    }
  }
})
