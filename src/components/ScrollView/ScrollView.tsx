import clsx from 'clsx';
import { defineComponent, ExtractPropTypes, PropType, ref, VNode } from 'vue';
import { canUse } from '../../utils/canUse';
import { required } from '../../utils/fixVueProps';
import { IconButton } from '../IconButton';
import { Item, ScrollViewEffect } from './Item';

const scrollViewProps = {
  data: {
    type: Array as PropType<Array<any>>,
    required,
  },
  renderItem: {
    type: Function as PropType<(item: any, index: number) => VNode>,
    required
  },
  effect: {
    type: String as PropType<ScrollViewEffect>,
    default: 'slide'
  },
  fullWidth: Boolean,
  scrollX: {
    type: Boolean,
    default: true
  },
  itemKey: [String, Function] as PropType<string | ((item: any, index: number) => string)>,
  onScroll: Function as PropType<(event: UIEvent) => void>,
  onIntersect: Function as PropType<(item: any, entry: IntersectionObserverEntry) => boolean>,
  hasControls: {
    type: Boolean,
    default: canUse('touch')
  }
}
export type ScrollViewProps = ExtractPropTypes<typeof scrollViewProps>

export const ScrollView = defineComponent({
  name: 'ScrollView',
  props: scrollViewProps,
  setup(props, {slots, expose, attrs}) {
    const elRef = ref<HTMLElement|null>(null)
    const scrollerRef = ref<HTMLElement|null>(null)
    expose({
      ref: elRef,
      scrollTo: ({ x, y }: { x?: number; y?: number }) => {
        if (!scrollerRef.value) return
        if (x != null) {
          scrollerRef.value.scrollLeft = x;
        }
        if (y != null) {
          scrollerRef.value.scrollTop = y;
        }
      },
    })

    const handlePreview = () => {
      const scroller = scrollerRef.value
      scroller && (scroller.scrollLeft -= scroller.offsetWidth)
    }

    const handleNext = () => {
      const scroller = scrollerRef.value
      scroller && (scroller.scrollLeft += scroller.offsetWidth)
    }

    function getItemKey(item: any, index: number) {
      let key;
      const itemKey = props.itemKey

      if (itemKey) {
        key = typeof itemKey === 'function' ? itemKey(item, index) : item[itemKey];
      }
      return key || index;
    }
    return () => {
      const { data, renderItem, effect, onIntersect, fullWidth, scrollX, hasControls } = props
      return (
        <div class={clsx(
            'ScrollView',
            {
              'ScrollView--fullWidth': fullWidth,
              'ScrollView--x': scrollX,
              'ScrollView--hasControls': hasControls,
            }
          )}
          ref={elRef}
          {...attrs}
        >
          {hasControls && <IconButton class="ScrollView-control" icon="chevron-left" onClick={handlePreview} />}
          <div class="ScrollView-scroller" ref={scrollerRef}>
            <div class="ScrollView-inner">
              {
                data.map((item, index) => (
                  <Item 
                    item={item}
                    effect={effect}
                    onIntersect={onIntersect}
                    key={getItemKey(item, index)}
                  >{renderItem(item, index)}</Item>
                ))
              }
              {slots.default ? (
                <Item item={{}} effect={effect} onIntersect={onIntersect}>
                  {slots.default()}
                </Item>
              ) : null}
            </div>
          </div>
          {hasControls && <IconButton class="ScrollView-control" icon="chevron-right" onClick={handleNext} />}
        </div>
      )
    }
  }
})
