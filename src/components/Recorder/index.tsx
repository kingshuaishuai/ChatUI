import clsx from 'clsx';
import { computed, defineComponent, ExtractPropTypes, onBeforeUnmount, onMounted, PropType, ref } from 'vue';
import { canUse } from '../../utils/canUse';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { useLocale } from '../LocaleProvider';

interface ButtonTextMap {
  [k: string]: string;
}

let ts = 0;
let startY = 0;
const MOVE_INTERVAL = 80;
const passive = canUse('passiveListener') ? { passive: false } : false;

const btnTextMap: ButtonTextMap = {
  inited: 'hold2talk',
  recording: 'release2send',
  willCancel: 'release2send',
};

const recorderProps = {
  canRecord: Boolean,
  volume: Number,
  onStart: Function as PropType<() => void>,
  onEnd: Function as PropType<(data: { duration: number }) => void>,
  onCancel:Function as PropType<() => void>,
}

export type RecorderProps = ExtractPropTypes<typeof recorderProps>

export const Recorder = defineComponent({
  name: 'Recorder',
  props: recorderProps,
  setup(props, { expose }) {
    const { status, isCancel, btnRef, doEnd} = useRecord(props)
    const { trans } = useLocale('Recorder')
    const wavesStyle = computed(() => ({
      transform: `scale(${(props.volume || 1) / 100 + 1})` 
    }))

    expose({
      ref: btnRef,
      stop: () => {
        status.value = 'inited',
        doEnd();
        ts = 0;
      }
    })
    return () => {
      return (
        <div ref={btnRef} class={clsx('Recorder', { 'Recorder--cancel': isCancel.value })}>
          {
            status.value !== 'inited' && (
              <Flex class="RecorderToast" direction="column" center>
                <div class="RecorderToast-waves" hidden={status.value !== 'recording'} style={wavesStyle.value}>
                  <Icon class="RecorderToast-wave-1" type="hexagon"></Icon>
                  <Icon class="RecorderToast-wave-2" type="hexagon"></Icon>
                  <Icon class="RecorderToast-wave-3" type="hexagon"></Icon>
                </div>
                <Icon class="RecorderToast-icon" type={isCancel.value ? 'cancel' : 'mic'} />
                <span>{trans(isCancel.value ? 'release2cancel' : 'releaseOrSwipe')}</span>
              </Flex>
            )
          }
          <div class="Recorder-btn" role="button" aria-label={trans('hold2talk')}>
            <span>{trans(btnTextMap[status.value])}</span>
          </div>
        </div>
      )
    }
  }
})

function useRecord(props: RecorderProps) {
  const btnRef = ref<HTMLElement | null>(null)
  const status = ref('inited')
  const isCancel = computed(() => status.value === 'willCancel')
  function doEnd() {
    const duration = Date.now() - ts;
    if (props.onEnd) {
      props.onEnd({ duration });
    }
  }

  function handleTouchStart(e: TouchEvent) {
    if (e.cancelable) {
      e.preventDefault();
    }
    const touch0 = e.touches[0];
    startY = touch0.pageY;
    ts = Date.now();
    status.value = 'recording'

    if (props.onStart) {
      props.onStart();
    }
  }

  function handleTouchMove(e: TouchEvent) {
    if (!ts) return;
    const nowY = e.touches[0].pageY;
    const isCancel = startY - nowY > MOVE_INTERVAL;
    status.value = isCancel ? 'willCancel' : 'recording'
  }

  function handleTouchEnd(e: TouchEvent) {
    if (!ts) return;
    const endY = e.changedTouches[0].pageY;
    const isRecording = startY - endY < MOVE_INTERVAL;

    status.value = 'inited'

    if (isRecording) {
      doEnd();
    } else if (props.onCancel) {
      props.onCancel();
    }
  }

  onMounted(() => {
    const wrapper = btnRef.value!;
    wrapper.addEventListener('touchstart', handleTouchStart);
    wrapper.addEventListener('touchmove', handleTouchMove, passive);
    wrapper.addEventListener('touchend', handleTouchEnd);
    wrapper.addEventListener('touchcancel', handleTouchEnd);
  })

  onBeforeUnmount(() => {
    const wrapper = btnRef.value!;
    wrapper.removeEventListener('touchstart', handleTouchStart);
    wrapper.removeEventListener('touchmove', handleTouchMove);
    wrapper.removeEventListener('touchend', handleTouchEnd);
    wrapper.removeEventListener('touchcancel', handleTouchEnd);
  })
  return {
    btnRef,
    status,
    isCancel,
    doEnd
  }
}