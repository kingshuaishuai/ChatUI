import { defineComponent, ExtractPropTypes, PropType } from 'vue';
import { required } from '../../utils/fixVueProps';
import { ToolbarButton } from './ToolbarButton'
import type { ToolbarItemProps } from './ToolbarButton'

const toolbarProps = {
  items: {
    type: Array as PropType<ToolbarItemProps[]>,
    required
  },
  onClick: {
    type: Function as PropType<(item: ToolbarItemProps, event: MouseEvent) => void>,
    required
  }
}

export type ToolbarProps = ExtractPropTypes<typeof toolbarProps>

export const Toolbar = defineComponent({
  name: 'Toolbar',
  props: toolbarProps,
  setup(props) {
    return () => {
      const { items, onClick } = props
      return (
        <div class="Toolbar">
          {
            items.map(item => <ToolbarButton key={item.type} item={item} onClick={onClick}/>)
          }
        </div>
      )
    }
  }
})
