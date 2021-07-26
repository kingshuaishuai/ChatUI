import { defineComponent, ExtractPropTypes, PropType } from 'vue';
import { required } from '../../utils/fixVueProps';
import { Icon } from '../Icon';

export interface ToolbarItemProps {
  type: string;
  title: string;
  icon?: string;
  img?: string;
  render?: any; // FIXME
}

export const toolbarButtonProps = {
  item: {
    type: Object as PropType<ToolbarItemProps>,
    required
  },
  onClick: {
    type: Function as PropType<(item: ToolbarItemProps, event: MouseEvent) => void>,
    required
  }
}

export type ToolbarButtonProps = ExtractPropTypes<typeof toolbarButtonProps>

export const ToolbarButton = defineComponent({
  name: 'ToolbarButton',
  props: toolbarButtonProps,
  setup(props) {
    return () => {
      const { item, onClick } = props
      const { type, title, icon, img } = item
      return (
        <div class="Toolbar-item" data-type={type}>
          <div class="Toolbar-btn" onClick={e => onClick(item, e)} role="button" tabindex={0}>
            <span class="Toolbar-btnIcon">
              {icon && <Icon type={icon} />}
              {img && <img class="Toolbar-img" src={img} alt="" />}
            </span>
            <span class="Toolbar-btnText">{title}</span>
          </div>
        </div>
      )
    }
  }
})
