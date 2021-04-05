import clsx from 'clsx';
import { Component, DefineComponent, defineComponent, ExtractPropTypes, getCurrentInstance, nextTick, onMounted, onUnmounted, PropType, reactive, ref, useContext, VNode } from 'vue';
import { canUse } from '../../utils/canUse';
import { setTransform } from '../../utils/style';
import { Icon } from '../Icon'
import { Flex } from '../Flex'
import { Button } from '../Button'

const willPreventDefault = canUse('passiveListener') ? { passive: false } : false;

type PullToRefreshStatus = 'pending' | 'pull' | 'active' | 'loading';

const pullToRefreshProps = {
  distance: {
    type: Number,
    default: 30
  },
  loadingDistance: {
    type: Number,
    default: 30
  },
  distanceRatio: {
    type: Number,
    default: 2
  },
  loadMoreText: {
    type: String,
    default: '点击加载更多'
  },
  maxDistance: Number,
  onRefresh: Function as PropType<() => Promise<any>>,
  onScroll: Function as PropType<(event: UIEvent) => void>,
  renderIndicator: {
    type: Function as PropType<(status: PullToRefreshStatus, distance: number) => Component | DefineComponent | VNode>,
    default: (status: PullToRefreshStatus) => {
      if (status === 'active' || status === 'loading') {
        return <Icon class="PullToRefresh-spinner" type="spinner" spin />;
      }
      return null;
    }
  }
}

export type PullToRefreshProps = ExtractPropTypes<typeof pullToRefreshProps>
export type PullToRefreshScroller = {
  scrollTo: ({ y, animated }: {
    y: number;
    animated: boolean;
  }) => void
  scrollToEnd: (animated?: boolean) => void
  reset: () => void
  handleLoadMore: () => void
}

type PullToRefreshState = {
  distance: number;
  status: PullToRefreshStatus;
  dropped: boolean;
  disabled: boolean;
};

export const PullToRefresh = defineComponent({
  name: 'PullToRefresh',
  props: pullToRefreshProps,
  setup(props, {slots}) {

    const {
      wrapperRef,
      contentRef,
      state,
      useFallback,
      scrollTo,
      scrollToEnd,
      reset,
      handleLoadMore,
    } = usePullToRefresh(props)

    const ctx = useContext()
    // 向外暴露方法
    ctx.expose({
      scrollTo,
      scrollToEnd,
      reset,
      handleLoadMore
    })

    return () => {
      let children = slots.default && slots.default()
      if (children && children.length > 1) {
        children = [children[0]]
        console.error('PullToRefresh component just can have one child node!')
      }
      const { status, distance, dropped, disabled } = state
      const { onScroll, loadMoreText, renderIndicator } = props
      return (
        <div ref={wrapperRef} class="PullToRefresh" onScroll={onScroll}>
          <div class="PullToRefresh-inner">
            <div
              class={clsx(
                'PullToRefresh-content',
                {'PullToRefresh-transition': dropped}
              )}
              ref={contentRef}
            >
              <div class="PullToRefresh-indicator">{renderIndicator(status, distance)}</div>
              {!disabled && useFallback && (
                <Flex class="PullToRefresh-fallback" center>
                  {renderIndicator(status, distance)}
                  <Button
                    class="PullToRefresh-loadMore"
                    variant="text"
                    onClick={handleLoadMore}
                  >
                    {loadMoreText}
                  </Button>
                </Flex>
              )}
              {children}
            </div>
          </div>
        </div>
      )
    }
  }
})

function usePullToRefresh(props: PullToRefreshProps) {
  const state = reactive<PullToRefreshState>({
    distance: 0,
    status: 'pending',
    dropped: false,
    disabled: !props.onRefresh
  })
  const wrapperRef = ref<HTMLElement | null>(null)
  const contentRef = ref<HTMLElement | null>(null)
  const useFallback = !canUse('touch')

  let startY = 0
  let canPull = false

  // scroll
  const scrollTo = ({y, animated = true}: {y: number; animated: boolean}) => {
    const scroller = wrapperRef.value
    if (!scroller) return

    if (canUse('smoothScroll') && animated) {
      scroller.scrollTo({
        top: y,
        behavior: 'smooth'
      })
    } else {
      scroller.scrollTop = y
    }
  }

  const scrollToEnd = (animated = true) => {
    const scroller = wrapperRef.value;
    if (!scroller) return

    const y = scroller.scrollHeight - scroller.offsetHeight;
    scrollTo({ y, animated });
  }

  const reset = () => {
    state.distance = 0
    state.status = 'pending'
    setContentStyle(0);
  }

  // load more
  const handleLoadMore = () => {
    const { loadingDistance, onRefresh } = props
    const scroller = wrapperRef.value;

    state.status = 'loading'
    nextTick(() => {
      if (!useFallback) {
        setContentStyle(loadingDistance)
      }
    })

    try {
      const sh = scroller!.scrollHeight
      if (onRefresh) {
        onRefresh()
          .then((res) => {
            const handleOffset = () => {
              scrollTo({
                y: scroller!.scrollHeight - sh - 50,
                animated: false,
              });
            };
            handleOffset();
            setTimeout(handleOffset, 150);
            setTimeout(handleOffset, 300);

            reset()

            if (res && res.noMore) {
              state.disabled = true
            }
          })
      }
    } catch (ex) {
      console.error(ex);
      reset();
    }
  }

  const setContentStyle = (y: number) => {
    const content = contentRef.value
    if (content) {
      setTransform(content, `translate3d(0px,${y}px,0)`);
    }
  }

  // handle touch
  const touchStart = (e: TouchEvent) => {
    startY = e.touches[0].clientY;
    canPull = wrapperRef.value!.scrollTop === 0;

    if (canPull) {
      state.status = 'pull'
      state.dropped = false
    }
  }
  const touchMove = (e: TouchEvent) => {
    const { distance, maxDistance, distanceRatio } = props
    const { status } = state

    const currentY = e.touches[0].clientY

    if (!canPull || currentY < startY || status === 'loading') return;

    let dist = (currentY - startY) / distanceRatio
    if (maxDistance && dist > maxDistance) {
      dist = maxDistance
    }

    if (dist > 0) {
      if (e.cancelable) {
        e.preventDefault();
      }
      e.stopPropagation();
      setContentStyle(dist)
      state.distance = dist
      state.status = dist >= distance ? 'active' : 'pull'
    }
  }
  const touchEnd = (e: TouchEvent) => {
    state.dropped = true

    if (state.status === 'active') {
      handleLoadMore()
    } else {
      reset()
    }
  }

  onMounted(() => {
    if (state.disabled || useFallback) {
      return;
    }
    const wrapper = wrapperRef.value
    if (wrapper) {
      wrapper.addEventListener('touchstart', touchStart)
      wrapper.addEventListener('touchmove', touchMove, willPreventDefault)
      wrapper.addEventListener('touchend', touchEnd)
      wrapper.addEventListener('touchcancel', touchEnd)
    }
  })

  onUnmounted(() => {
    const wrapper = wrapperRef.value
    if (wrapper) {
      wrapper.removeEventListener('touchstart', touchStart)
      wrapper.removeEventListener('touchmove', touchMove)
      wrapper.removeEventListener('touchend', touchEnd)
      wrapper.removeEventListener('touchcancel', touchEnd)
    }
  })

  return {
    state,
    wrapperRef,
    contentRef,
    useFallback,
    scrollTo,
    scrollToEnd,
    reset,
    handleLoadMore,
  }
}
