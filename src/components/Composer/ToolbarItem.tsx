import { defineComponent, ExtractPropTypes, PropType } from 'vue';
import { required } from '../../utils/fixVueProps';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import type { ToolbarItemProps } from '../Toolbar';

const toolbarItemProps = {
  item: {
    type: Object as PropType<ToolbarItemProps>,
    required
  },
  onClick: {
    type: Function as PropType<(e: MouseEvent) => void>,
    required
  }
}

export type IToolbarItemProps = ExtractPropTypes<typeof toolbarItemProps>

export const ToolbarItem = defineComponent({
  name: 'ToolbarItem',
  props: toolbarItemProps,
  setup(props) {
    return () => {
      const {item, onClick} = props

      if (item.img) {
        return (
          <Button class="IconBtn" data-tooltip aria-label={item.title} onClick={onClick}>
            <img src={item.img} alt="" />
          </Button>
        )
      }
      return (
        <IconButton
          icon={item.icon || ''}
          data-icon={item.icon}
          data-tooltip
          aria-label={item.title}
          onClick={onClick}
        />
      )
    }
  }
})
