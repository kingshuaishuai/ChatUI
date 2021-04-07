import { defineComponent, ExtractPropTypes, onMounted, PropType, Ref, ref, useContext, VNode } from 'vue';
import { required } from '../../utils/fixVueProps';
import { Message, MessageType } from '../Message/Message';
import { PullToRefresh } from '../PullToRefresh';
import type { PullToRefreshScroller } from '../PullToRefresh'

const messageContainerProps = {
  messages: {
    type: Array as PropType<Array<MessageType>>,
    default: []
  },
  loadMoreText: String,
  onRefresh: Function as PropType<() => Promise<any>>,
  onScroll: Function as PropType<(event: UIEvent) => void>,
  renderBeforeMessageList: Function as PropType<() => VNode>,
  renderMessageContent: {
    type: Function as PropType<(message: MessageType) => VNode>,
    required: required
  },
  scrollRef: Function as PropType<(ref: Ref<any>) => void>
}

export type MessageContainerProps = ExtractPropTypes<typeof messageContainerProps>

export const MessageContainer = defineComponent({
  name: 'MessageContainer',
  props: messageContainerProps,
  setup(props, {slots, expose}) {
    const scrollerRef = ref<PullToRefreshScroller | null>(null)
    expose({
      scroller: scrollerRef
    })
    return () => {
      const { onRefresh, onScroll, loadMoreText, messages, renderMessageContent, renderBeforeMessageList } = props
      return (
        <div class="MessageContainer">
          {
            renderBeforeMessageList 
            ? renderBeforeMessageList() 
            // 兼容vue template slot
            : slots.renderBeforeMessageList && slots.renderBeforeMessageList()
          }
          <PullToRefresh
            onRefresh={onRefresh}
            onScroll={onScroll}
            loadMoreText={loadMoreText}
            ref={scrollerRef}
          >
            <div class="MessageList">
              {messages.map(msg => (
                <Message {...msg} renderMessageContent={renderMessageContent} key={msg._id} v-slots={{renderMessageContent: slots.renderMessageContent}}></Message>
              ))}
            </div>
          </PullToRefresh>
        </div>
      )
    }
  }
})
