import clsx from 'clsx';
import { defineComponent, ExtractPropTypes, PropType } from 'vue';
import { required } from '../../utils/fixVueProps';
import { Avatar } from '../Avatar';
import { Time } from '../Time';
import { Typing } from '../Typing';
import { SystemMessage } from './SystemMessage'

type User = {
  avatar: string;
}

export type MessageId = string | number

const messageProps = {
  /**
   * 唯一ID
   */
  _id: {
    type: String as PropType<MessageId>,
    required
  },
  /**
   * 消息类型
   */
  type: {
    type: String,
    required
  },
  /**
   * 消息内容
   */
  content: String as any,
  /**
   * 消息创建时间
   */
  createdAt: Number,
   /**
    * 消息发送者信息
    */
  user: Object as PropType<User>,
   /**
    * 消息位置
    */
  position: String as PropType<'left' | 'right' | 'center'>,
   /**
    * 是否显示时间
    */
  hasTime: Boolean,
   /**
    * 消息内容渲染函数
    */
  renderMessageContent: Function as PropType<(message: any) => void>
}

export type MessageProps = ExtractPropTypes<typeof messageProps>
export type MessageType = Omit<MessageProps, 'renderMessageContent'>

export const Message = defineComponent({
  name: 'Message',
  props: messageProps,
  setup(props, {slots}) {
    return () => {
      const { renderMessageContent = () => null, ...msg } = props
      const { _id: id, type, content, user } = msg

      if (type === 'system') {
        return <SystemMessage content={content.text} action={content.action} key={id} />;
      }    

      return (
        <div class={clsx('Message', msg.position)} key={id} data-type={type}>
          {
            msg.hasTime && msg.createdAt && (
              <div class="Message-meta">
                <Time date={msg.createdAt} />
              </div>
            )
          }
          <div class="Message-content">
            {user && user.avatar && <Avatar src={user.avatar} /> }
            {type === 'typing' ? <Typing /> : (
              renderMessageContent 
              ? renderMessageContent(msg) 
              : slots.renderMessageContent && slots.renderMessageContent(msg)
            )} 
          </div>
        </div>
      )
    }
  }
})
