import { DefineComponent } from 'vue'

declare global {
  namespace JSX {
    interface Element extends DefineComponent {}
  }
}
