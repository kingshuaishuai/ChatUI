import { defineComponent, ExtractPropTypes, ref, PropType, onMounted, onUnmounted, onUpdated } from 'vue';

export type ScrollViewEffect = 'slide'

const scrollViewItemProps = {
  item: [ Number, String, Boolean, Object, Array ] as PropType<any>,
  effect: String as PropType<ScrollViewEffect>,
  onIntersect: Function as PropType<(item: any, entry: IntersectionObserverEntry) => boolean>
}

export type ScrollViewItemProps = ExtractPropTypes<typeof scrollViewItemProps>

function useIntersectionObserver(props: ScrollViewItemProps) {
  const itemRef = ref<HTMLElement | null>(null)
  const { item, onIntersect } = props

  let observer: IntersectionObserver
  const handleObserve = () => {
    if (!onIntersect) return
    observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry.intersectionRatio > 0) {
        // 根据回调返回值判断是否继续监听
        if (!onIntersect(item, entry)) {
          observer.unobserve(entry.target);
        }
      }
    }, {
      threshold: [0, 0.1]
    })
    if (itemRef.value) {
      observer.observe(itemRef.value)
    }
  }
  onMounted(handleObserve)
  onUpdated(handleObserve)

  onUnmounted(() => {
    observer && observer.disconnect()
  })

  return {
    itemRef
  }
}

export const Item = defineComponent({
  name: 'ScrollViewItem',
  props: scrollViewItemProps,
  setup(props, {slots}) {
    const { itemRef } = useIntersectionObserver(props)
    return () => {
      return (
        <div ref={itemRef} class="ScrollView-item">
          {slots.default && slots.default()}
        </div>
      )
    }
  }
})
