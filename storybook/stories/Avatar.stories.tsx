import { Story, Meta } from '@storybook/vue3/types-6-0'
import { Avatar, AvatarProps } from '../../src'
import '../../src/components/Avatar/style.less'
import '@vue/babel-plugin-jsx'

export default {
  title: 'Avatar',
  component: Avatar
} as Meta

const Template: Story<AvatarProps> = (args) => {
  return (
    <Avatar {...args} />
  )
}

export const Default = Template.bind({})
Default.args = {
  src: '//gw.alicdn.com/tfs/TB1U7FBiAT2gK0jSZPcXXcKkpXa-108-108.jpg',
  alt: 'name',
}