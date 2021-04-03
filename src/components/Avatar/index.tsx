import { PropType, defineComponent, ExtractPropTypes } from "vue";
import clsx from "clsx"

export type AvatarSize = 'sm' | 'md' | 'lg';

export type AvatarShape = 'circle' | 'square';

const avatarProps = {
  src: String,
  alt: String,
  url: String,
  size: {
    type: String as PropType<AvatarSize>,
    default: 'md'
  },
  shape: {
    type: String as PropType<AvatarShape>,
    default: 'square'
  },
}

export type AvatarProps = ExtractPropTypes<typeof avatarProps>

export const Avatar = defineComponent({
  name: 'Avatar',
  props: avatarProps,
  setup(props) {
    return () => {
      const {url, size, shape, src, alt} = props
      const Element = url ? 'a' : 'span'

      return (
        <Element
          class={clsx('Avatar', `Avatar--${size}`, `Avatar--${shape}`)}
          href={url}
        >
          <img src={src} alt={alt} />
        </Element>
      )
    }
  }
})
