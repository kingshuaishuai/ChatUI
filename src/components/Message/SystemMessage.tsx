import { defineComponent, ExtractPropTypes, PropType } from 'vue';
import { required } from '../../utils/fixVueProps'

const systemMessageProps = {
  content: {
    type: String,
    required
  },
  action: Object as PropType<{
    text: string;
    onClick: (event: MouseEvent) => void;
  }>
}

export type SystemMessageProps = ExtractPropTypes<typeof systemMessageProps>

export const SystemMessage = defineComponent({
  name: 'SystemMessage',
  props: systemMessageProps,
  setup(props) {
    return () => {
      const { content, action } = props
      return (
        <div class="Message SystemMessage">
          <span>{content}</span>
          {action && (
            <a href="javascript:;" onClick={action.onClick}>
              {action.text}
            </a>
          )}
        </div>
      )
    }
  }
})
