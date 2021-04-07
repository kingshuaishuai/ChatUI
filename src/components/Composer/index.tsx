import { defineComponent, ExtractPropTypes } from 'vue';

const composerProps = {}
export type ComposerProps = ExtractPropTypes<typeof composerProps>

export const Composer = defineComponent({
  name: 'Composer',
  props: composerProps,
  setup() {
    return () => {
      return (
        <div>Composer</div>
      )
    }
  }
})
