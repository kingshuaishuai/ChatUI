import { defineComponent } from 'vue';
import { Bubble } from '../Bubble'

export const Typing = defineComponent({
  name: 'Typing',
  setup() {
    return () => {
      return (
        <Bubble type="typing">
          <div class="Typing" aria-busy="true">
            <div class="Typing-dot"></div>
            <div class="Typing-dot"></div>
            <div class="Typing-dot"></div>
          </div>
        </Bubble>
      )
    }
  }
})
