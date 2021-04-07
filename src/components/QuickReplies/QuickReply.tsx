import clsx from 'clsx';
import { defineComponent, ExtractPropTypes, PropType } from 'vue';
import { required } from '../../utils/fixVueProps';
import { Icon } from '../Icon';

export interface QuickReplyItemProps {
  name: string;
  code?: string;
  icon?: string;
  img?: string;
  isNew?: boolean;
  isHighlight?: boolean;
}

const quickReplyProps = {
  item: {
    type: Object as PropType<QuickReplyItemProps>,
    required
  },
  index: {
    type: Number,
    required
  },
  onClick: {
    type: Function as PropType<(item: QuickReplyItemProps, index: number) => void>,
    required
  }
}

export type QuickReplyProps = ExtractPropTypes<typeof quickReplyProps>

export const QuickReply = defineComponent({
  name: 'QuickReply',
  props: quickReplyProps,
  setup(props) {
    const handleClick = () => {
      props.onClick(props.item, props.index)
    }
    return () => {
      const { item } = props
      return (
        <button
          class={clsx(
            'QuickReply',
            {
              new: item.isNew,
              highlight: item.isHighlight
            }
          )}
          onClick={handleClick}
          type="button"
          data-code={item.code}
          aria-label={`快捷短语: ${item.name}，双击发送`}
        >
          <div class="QuickReply-inner">
            {item.icon && <Icon type={item.icon}/>}
            {item.img && <img class="QuickReply-img" src={item.img} alt="" />}
            <span>{item.name}</span>
          </div>
        </button>
      )
    }
  }
})
