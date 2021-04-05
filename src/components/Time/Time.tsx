import { defineComponent, ExtractPropTypes, PropType } from 'vue';
import { required } from '../../utils/fixVueProps';
import { useLocale } from '../LocaleProvider'
import formatDate, { IDate } from './parser';

const timeProps = {
  date: {
    type: [String, Number, Object] as PropType<IDate>,
    required: required
  }
}

export type TimeProps = ExtractPropTypes<typeof timeProps>

export const Time = defineComponent({
  name: 'Time',
  props: timeProps,
  setup(props) {
    const { trans } = useLocale('Time')
    return () => {
      const { date } = props
      return (
        <time class="Time" datetime={new Date(date).toJSON()}>
         {formatDate(date, trans())}
        </time>
      )
    }
  }
})
