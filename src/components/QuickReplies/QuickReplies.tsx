import { defineComponent, ExtractPropTypes, PropType } from 'vue';
import { required } from '../../utils/fixVueProps';
import { ScrollView } from '../ScrollView';
import { QuickReply, QuickReplyItemProps } from './QuickReply';

const quickRepliesProps = {
  items: {
    type: Array as PropType<Array<QuickReplyItemProps>>,
    required
  },
  onClick: {
    type: Function as PropType<(item: QuickReplyItemProps, index: number) => void>,
    required
  },
  visible: Boolean,
  onScroll: Function as PropType<(event: UIEvent) => void>
}

export type QuickRepliesProps = ExtractPropTypes<typeof quickRepliesProps>

export const QuickReplies = defineComponent({
  name: 'QuickReplies',
  props: quickRepliesProps,
  setup(props) {
    return () => {
      const { items, visible, onClick, onScroll } = props
      return (
        <ScrollView
          class="QuickReplies"
          data={items}
          itemKey="code"
          data-visible={visible}
          fullWidth
          onScroll={onScroll}
          renderItem={(item, index) => (
            <QuickReply item={item} index={index} onClick={onClick}></QuickReply>
          )}
        />
      )
    }
  }
})
