const ua = navigator.userAgent
const iOS = /iPad|iPhone|iPod/.test(ua)

enum ScrollType {
  ignore,
  scrollTop,
  scrollIntoView,
}

function testScrollType() {
  if (iOS) {
    if (ua.includes('Safari/') || /OS 11_[0-3]\D/.test(ua)) {
      /**
       * 不处理
       * - Safari
       * - iOS 11.0-11.3（`scrollTop`/`scrolIntoView` 有 bug）
       */
      return ScrollType.ignore
    }
    return ScrollType.scrollTop
  }

  return ScrollType.scrollIntoView
}

/**
 * IOS中有些情况会出现键盘弹起将页面顶上去，但是页面没有自动滚下来的情况，riseInput函数用来解决此Bug
 */
export default function riseInput(input: HTMLElement, target: HTMLElement) {
  const scrollType = testScrollType()
  let scrollTimer: ReturnType<typeof setTimeout>

  if (!target) {
    target = input
  }

  const scrollIntoView = () => {
    if (scrollType === ScrollType.ignore) return
    if (scrollType === ScrollType.scrollTop) {
      document.body.scrollTop = document.body.scrollHeight
    } else {
      target.scrollIntoView(false)
    }
  }

  input.addEventListener('focus', () => {
    setTimeout(scrollIntoView, 300)
    scrollTimer = setTimeout(scrollIntoView, 1000)
  })

  input.addEventListener('blur', () => {
    clearTimeout(scrollTimer)

    // 某些情况下收起键盘后输入框不收回，页面下面空白
    // 比如：闲鱼、大麦、乐动力、微信
    if (scrollType && iOS) {
      // 以免点击快捷短语无效
      setTimeout(() => {
        document.body.scrollIntoView()
      })
    }
  })
}
