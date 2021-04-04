export const setTransform = (el: HTMLElement, value: string): void => {
  el.style.transform = value
  el.style.webkitTransform = value
}

export const setTransition = (el: HTMLElement, value: string): void => {
  el.style.transition = value
  el.style.webkitTransition = value
}
