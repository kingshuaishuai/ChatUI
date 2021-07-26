import { defineComponent, ExtractPropTypes } from 'vue';
import { required } from '../../utils/fixVueProps';
import { Button, buttonProps } from '../Button'
import { Icon } from '../Icon';

export const iconButtonProps = {
  ...buttonProps,
  icon: {
    type: String,
    required
  }
}

export type IconButtonProps = ExtractPropTypes<typeof iconButtonProps>

export const IconButton = defineComponent({
  name: 'IconButton',
  props: iconButtonProps,
  setup(props) {
    return () => {
      const { icon, ...others } = props;
      return (
        <Button class="IconBtn" {...others}>
          <Icon type={icon}/>
        </Button>
      )
    }
  }
})
