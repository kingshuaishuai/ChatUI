import clsx from 'clsx';
import { computed, defineComponent, ExtractPropTypes, onMounted, onUnmounted, PropType, ref, watch, watchEffect } from 'vue';
import { required } from '../../utils/fixVueProps';
import parseDataTransfer from '../../utils/parseDataTransfer';
import toggleClass from '../../utils/toggleClass';
import { ClickOutside } from '../ClickOutside';
import { IconButtonProps } from '../IconButton';
import { Input } from '../Input'
import { Recorder, RecorderProps } from '../Recorder';
import { Toolbar } from '../Toolbar';
import type { ToolbarItemProps } from '../Toolbar';
import { Action } from './Action';
import riseInput from './riseInput';
import { ToolbarItem } from './ToolbarItem';

export type InputType = 'voice' | 'text';

const NO_HOME_BAR = 'S--noHomeBar';

const composerProps = {
  wideBreakpoint: String,
  onSend: {
    type: Function as PropType<(type: string, content: string) => void>,
    required: required
  },
  placeholder: String,
  onFocus: Function as PropType<(event: FocusEvent) => void>,
  onBlur: Function as PropType<(event: any) => void>,
  onChange: Function as PropType<(event: any) => void>,
  onInput: Function as PropType<(event: any) => void>,
  onImageSend: Function as PropType<(file: File) => Promise<any>>,
  inputType: {
    type: String as PropType<InputType>,
    default: 'text'
  },
  onInputTypeChange: Function as PropType<(inputType: InputType) => void>,
  rightAction: Object as PropType<IconButtonProps>,
  recorder: {
    type: Object as PropType<RecorderProps>,
    default: () => ({
      canRecord: true
    })
  },
  toolbar: Array as PropType<ToolbarItemProps[]>,
  onToolbarClick: Function as PropType<(item: ToolbarItemProps, event: MouseEvent) => void>,
  onAccessoryToggle: Function as PropType<(isAccessoryOpen: boolean) => void>
}
export type ComposerProps = ExtractPropTypes<typeof composerProps>

export const Composer = defineComponent({
  name: 'Composer',
  props: composerProps,
  setup(props) {
    const text = ref('')
    const inputType = ref<InputType>(props.inputType)
    const isInputText = computed(() => inputType.value === 'text')
    const inputTypeIcon = computed(() => isInputText.value ? 'mic' : 'keyboard')
    const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)
    const composerRef = ref<HTMLElement | null>(null)
    const pastedImage = ref<File | null>(null)
    const isAccessoryOpen = ref(false)
    const accessoryContent = ref<any>('')
    let blurTimer: any, focused: boolean
    const hasToolbar = computed(() => props.toolbar && props.toolbar.length > 0)
    const { isWide } = useIsWide(props)

    watchEffect(() => {
      toggleClass('S--wide', isWide.value)
      if (!isWide.value) {
        accessoryContent.value = ''
      }
    })

    const handleInputTypeChange = () => {
      const isVoice = inputType.value === 'voice';
      const nextType = isVoice ? 'text' : 'voice';

      inputType.value = nextType

      if (isVoice) {
        const input = inputRef.value as HTMLInputElement
        input.focus()
        input.selectionStart = input.selectionEnd = input.value.length
      } else {
        props.onInputTypeChange && props.onInputTypeChange(inputType.value)
      }
    }

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

    function handleAccessoryToggle() {
      isAccessoryOpen.value = !isAccessoryOpen.value
      props.onAccessoryToggle && props.onAccessoryToggle(isAccessoryOpen.value)
    }

    onMounted(() => {
      if (inputRef.value && composerRef.value ) {
        riseInput(inputRef.value, composerRef.value)
      }
    })

    function handleSendBtnClick(e: MouseEvent) {
      send();
      e.preventDefault();
    }
    
    const renderInput = () => (
      <div class={clsx({ 'S--invisible': !isInputText.value })}>
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

    function handleToolbarClick(item: ToolbarItemProps, e: MouseEvent) {
      if (props.onToolbarClick) {
        props.onToolbarClick(item, e)
      }
      if (item.render) {
        accessoryContent.value = item.render()
      }
    }

    function handleAccessoryBlur() {
      setTimeout(() => {
        isAccessoryOpen.value = false
        accessoryContent.value = ''
      })
    }
    function renderExtra() {
      const accessory = accessoryContent.value || <Toolbar items={props.toolbar || []} onClick={handleToolbarClick} />
      return (
        <ClickOutside onClick={handleAccessoryBlur}>
          {accessory}
        </ClickOutside>
      )
    }
    return () => {
      const { recorder, rightAction, toolbar } = props
      // TODO： isWide要改成isWide.value,这里为了测试isWide为true
      if (isWide) {
        return (
          <div class="Composer Composer--lg" ref={composerRef}>
            {
              hasToolbar.value && (
                <div class="Composer-toolbar">
                  {
                    toolbar && toolbar.map(item => (<ToolbarItem key={item.type} item={item} onClick={(e) => handleToolbarClick(item, e)} />))
                  }
                </div>
              )
            }
            {
              // TODO: Popover需要替换为Popover组件
              accessoryContent.value && <div class="popover">
                {accessoryContent.value}
              </div>
            }
            <div class="Composer-inputWrap">{renderInput()}</div>
            <Action
              class="Composer-sendBtn"
              icon="paper-plane"
              color="primary"
              disabled={!text.value}
              onMousedown={handleSendBtnClick}
              aria-label="发送"
            />
          </div>
        )
      }
      return (
        <>
          <div class="Composer" ref={composerRef}>
            {
              recorder.canRecord && <Action
                class="Composer-inputTypeBtn"
                icon={inputTypeIcon.value}
                data-icon={inputTypeIcon.value}
                onClick={handleInputTypeChange}
                aria-label={isInputText.value ? '切换到语音输入' : '切换到键盘输入'}
              />
            }
            <div class="Composer-inputWrap">
              {renderInput()}
              {!isInputText.value && <Recorder {...recorder} />}
            </div>
            {!text.value && rightAction && <Action {...rightAction} />}
            {hasToolbar.value && (
              <Action
                class={clsx('Composer-toggleBtn', {
                  active: isAccessoryOpen.value,
                })}
                icon="plus"
                onClick={handleAccessoryToggle}
                aria-label={isAccessoryOpen.value ? '关闭工具栏' : '展开工具栏'}
              />
            )}
            {text.value && (
              <Action
                class="Composer-sendBtn"
                icon="paper-plane"
                color="primary"
                onMousedown={handleSendBtnClick}
                aria-label="发送"
              />
            )}
          </div>
          {isAccessoryOpen.value && renderExtra()}
        </>
      )
    }
  }
})


function useIsWide(props: any) {
  const isWide = ref(false)
  let mq: false | MediaQueryList
  function handleMq(e: MediaQueryListEvent) {
    isWide.value = e.matches
  }
  watchEffect(() => {
    mq = props.wideBreakpoint && window.matchMedia
      ? window.matchMedia(`(min-width: ${props.wideBreakpoint})`)
      : false

    isWide.value = mq && mq.matches

    if (mq) {
      mq.addListener(handleMq);
    }
  })
    
  onUnmounted(() => {
    if (mq) {
      mq.removeListener(handleMq)
    }
  })
  return { isWide }
}