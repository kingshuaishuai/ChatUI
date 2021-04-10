import { defineComponent, ExtractPropTypes, onMounted, PropType, ref, watch, watchEffect } from 'vue';
import { required } from '../../utils/fixVueProps';
import parseDataTransfer from '../../utils/parseDataTransfer';
import toggleClass from '../../utils/toggleClass';
import { Input } from '../Input'

const NO_HOME_BAR = 'S--noHomeBar';

const composerProps = {
  onSend: {
    type: Function as PropType<(type: string, content: string) => void>,
    required: required
  },
  placeholder: String,
  onFocus: Function as PropType<(event: FocusEvent) => void>,
  onBlur: Function as PropType<(event: any) => void>,
  onChange: Function as PropType<(event: any) => void>,
  onInput: Function as PropType<(event: any) => void>,
  onImageSend: Function as PropType<(file: File) => Promise<any>>
}
export type ComposerProps = ExtractPropTypes<typeof composerProps>

export const Composer = defineComponent({
  name: 'Composer',
  props: composerProps,
  setup(props) {
    const text = ref('')
    const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)
    const pastedImage = ref<File | null>(null)
    let blurTimer: any, focused: boolean

    const handleInputFocus = (e: FocusEvent) => {
      clearTimeout(blurTimer)
      toggleClass(NO_HOME_BAR, true)
      focused = true
      if (props.onFocus) {
        props.onFocus(e)
      }
    }

    const handleInputBlur = (e: any) => {
      blurTimer = setTimeout(() => {
        toggleClass(NO_HOME_BAR, false)
        focused = false
      }, 0)
      if (props.onBlur) {
        props.onBlur(e)
      }
    }

    function send() {
      props.onSend('text', text.value)
      text.value = ''

      if (focused) {
        inputRef.value!.focus()
      }
    }

    function handleInputKeyDown(e: KeyboardEvent) {
      if (!e.shiftKey && e.keyCode === 13) {
        send();
        e.preventDefault();
      }
    }

    function handlePaste(e: ClipboardEvent) {
      parseDataTransfer(e, (file) => {
        pastedImage.value = file
      })
    }
    
    const renderInput = () => (
      <div>
        <Input
          v-model={text.value}
          ref={(input: any) => inputRef.value = input.ref}
          class="Composer-input"
          placeholder={props.placeholder}
          rows={1}
          autoSize
          enterKeyHint="send"
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeydown={handleInputKeyDown}
          onChange={props.onChange}
          onInput={props.onInput}
          onPaste={props.onImageSend ? handlePaste : undefined}
        />
        {
          handlePaste && <div></div>
        }
      </div>
    )
    return () => {
      return (
        <div class="Composer">
          <div class="Composer-inputWrap">
            {renderInput()}
          </div>
        </div>
      )
    }
  }
})
