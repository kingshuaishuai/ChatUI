import { defineComponent, ExtractPropTypes } from 'vue';

const navbarProps = {}
export type NavbarProps = ExtractPropTypes<typeof navbarProps>

export const Navbar = defineComponent({
  name: 'Navbar',
  props: navbarProps,
  setup() {
    return () => {
      return (
        <div>Navbar</div>
      )
    }
  }
})
