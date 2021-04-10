import { defineComponent, ExtractPropTypes, PropType, ref, VNode } from 'vue';
import { required } from '../../utils/fixVueProps';
import { MessageType } from '../Message';
import { MessageContainer } from '../MessageContainer';
import { LocaleProvider } from '../LocaleProvider'
import { Navbar } from '../Navbar'
import type { NavbarProps } from '../Navbar'
import { QuickReplies, QuickReplyItemProps } from '../QuickReplies'
import { Composer } from '../Composer'

const chatProps = {
  locale: String,
  locales: Object,
  /**
   * 导航栏渲染函数
   */
  renderNavbar: Function as PropType<() => VNode>,
  navbar: Object as PropType<NavbarProps>,
  /**
   * 加载更多文案
   */
  loadMoreText: String,
  /**
   * 消息列表
   */
  messages: {
    type: Array as PropType<Array<MessageType>>,
    required
  },
  /**
   * 在消息列表上面的渲染函数
   */
  renderBeforeMessageList: {
    type: Function as PropType<() => VNode>
  },
  /**
   * 消息内容渲染函数
   */
  renderMessageContent: {
    type: Function as PropType<(message: MessageType) => VNode>,
    required
  },
  /**
   * 下拉加载回调
   */
  onRefresh: Function as PropType<() => Promise<any>>,
  /**
  * 滚动消息列表回调
  */
  onScroll: Function as PropType<() => void>,
  /**
   * 快捷短语渲染函数
   */
  renderQuickReplies: Function as PropType<() => VNode>,
  /**
   * 快捷短语
   */
   quickReplies: Array as PropType<QuickReplyItemProps[]>,
   /**
    * 快捷短语是否可见
    */
   quickRepliesVisible: Boolean,
   /**
    * 快捷短语的点击回调
    */
   onQuickReplyClick: {
     type: Function as PropType<(item: QuickReplyItemProps, index: number) => void>,
     default: () => {
      //  do nothing
     }
   },
   /**
    * 快捷短语的滚动回调
    */
   onQuickReplyScroll: Function as PropType<() => void>,
   /**
   * 发送消息回调
   */
  onSend: {
    type: Function as PropType<(type: string, content: string) => void>,
    required: required
  }
}

export type ChatProps = ExtractPropTypes<typeof chatProps>

export const Chat = defineComponent({
  name: 'Chat',
  props: chatProps,
  setup(props, {slots, expose, attrs}) {
    const chatRootRef = ref<HTMLElement|null>(null)
    const messageRef = ref<HTMLElement|null>(null)

    expose({
      ref: chatRootRef,
      messageRef
    })
    
    return () => {
      const {
        locale = 'zh_CN',
        locales,
        navbar,
        renderNavbar,
        loadMoreText,
        messages,
        onRefresh,
        onScroll,
        renderMessageContent,
        renderBeforeMessageList,
        renderQuickReplies,
        quickReplies,
        quickRepliesVisible,
        onQuickReplyClick,
        onQuickReplyScroll,
        onSend
      } = props
      return (
        <LocaleProvider locale={locale} locales={locales}>
          <div ref={chatRootRef} class="ChatApp" {...attrs}>
            {/* renderNavbar兼容slots */}
            {renderNavbar ? renderNavbar() : (
              slots.renderNavbar ? slots.renderNavbar() : navbar && <Navbar {...navbar} />
            )}
            <MessageContainer
              ref={(mc:any) => messageRef.value = mc.scroller}
              v-slots={{
                renderMessageContent: slots.renderMessageContent,
                renderBeforeMessageList: slots.renderBeforeMessageList
              }}
              loadMoreText={loadMoreText}
              messages={messages}
              renderMessageContent={renderMessageContent}
              renderBeforeMessageList={renderBeforeMessageList}
              onRefresh={onRefresh}
              onScroll={onScroll}
            />
            <div class="ChatFooter">
              {/* 兼容slots */}
              {
                renderQuickReplies ? renderQuickReplies() : (
                  slots.renderQuickReplies ? slots.renderQuickReplies()
                    :
                    quickReplies && <QuickReplies
                      items={quickReplies}
                      visible={quickRepliesVisible}
                      onClick={onQuickReplyClick}
                      onScroll={onQuickReplyScroll}
                    />
                )
              }
              <Composer onSend={onSend}/>
            </div>
          </div>
        </LocaleProvider>
      )
    }
  }
})
