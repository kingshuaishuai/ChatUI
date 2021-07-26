import clsx from 'clsx';
import { computed, defineComponent, ExtractPropTypes, PropType, ref } from 'vue';
import { useRows } from './hooks';

const inputProps = {
  rows: {
    type: Number,
    default: 1
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  onChange: {
    type: Function as PropType<(e: any) => void>,
    default: () => {
      // do nothing
    }
  },
  onInput: Function as PropType<(e: any) => void>,
  onFocus: Function as PropType<(event: FocusEvent) => void>,
  onBlur: Function as PropType<(event: any) => void>,
  onKeydown: Function as PropType<(event: KeyboardEvent) => void>,
  onKeyup: Function as PropType<(event: KeyboardEvent) => void>,
  onPaste: Function as PropType<(event: ClipboardEvent) => void>,
  modelValue: String,
  minRows: {
    type: Number,
    default: 1
  },
  maxRows: {
    type: Number,
    default: 5
  },
  multiline: Boolean,
  autoSize: Boolean,
  maxLength: Number,
  enterKeyHint: String as PropType<'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'>,
}

export type InputProps = ExtractPropTypes<typeof inputProps>

export const Input = defineComponent({
  name: 'Input',
  props: inputProps,
  setup(props, {emit, expose}) {
    
    const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)
    const { updateRow } = useRows(props, inputRef)

    const isMultiline = computed(() => props.multiline || props.autoSize || props.rows > 1)

    const onChange = (event: any) => {  
      props.onChange(event)
    }

    const onInput = (event: any) => {
      updateRow()
      const inputVal = event.target.value;
      const shouldTrim = props.maxLength && inputVal.length > props.maxLength;
      const val = shouldTrim ? inputVal.substr(0, props.maxLength) : inputVal;
      event.target.value = val
      props.onInput && props.onInput(event)
      emit('update:modelValue', val)
    }
    expose({
      ref: inputRef
    })
    return () => {
      const Element = isMultiline.value ? 'textarea' : 'input';
      const { rows, type, placeholder, onFocus, onBlur, onKeyup, onKeydown, onPaste } = props
      const inputProps = {
        class: clsx('Input'),
        type,
        placeholder,
        onChange,
        onInput,
        onFocus,
        onBlur,
        onKeyup,
        onKeydown,
        onPaste,
        rows
      }
      return (
        <Element ref={inputRef} value={props.modelValue} {...inputProps}/>
      )
    }
  }
})
