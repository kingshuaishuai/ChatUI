const noop = () => undefined

const testCache: {
  [key in 'passiveListener' | 'smoothScroll' | 'touch']: () => boolean
} & {
  [key: string]: (args: any) => boolean
} = {
  passiveListener: () => {
    let supportsPassive = false
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get() {
          supportsPassive = true
        },
      })
      window.addEventListener('test', noop, opts)
    } catch (e) {
      // do nothing
    }
    return supportsPassive
  },
  smoothScroll: () => 'scrollBehavior' in document.documentElement.style,
  touch: () => 'ontouchstart' in window,
}

type TestName = 'passiveListener' | 'smoothScroll' | 'touch'

export function addTest(name: string, test: (args: any) => boolean): void {
  testCache[name] = test
}

export function canUse(name: TestName): boolean {
  return testCache[name]()
}
